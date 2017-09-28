import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'

import {StatFinanceGridList} from '../../components/Statistics'
import {STAT_FINANCE_FILTER_KEY} from '../../components/Statistics/Finance/StatFinanceGridList'

import {
    statFinanceInDataFetchAction,
    statFinanceOutDataFetchAction,
    statFinanceListFetchAction
} from '../../actions/statFianace'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphIn = _.get(state, ['statFinance', 'dataIn', 'data'])
        const graphOut = _.get(state, ['statFinance', 'dataOut', 'data'])
        const graphInLoading = _.get(state, ['statFinance', 'dataIn', 'loading'])
        const graphOutLoading = _.get(state, ['statFinance', 'dataOut', 'loading'])
        const list = _.get(state, ['statFinance', 'list', 'data'])
        const listLoading = _.get(state, ['statFinance', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            list,
            listLoading,
            graphIn,
            graphOut,
            graphInLoading,
            graphOutLoading,
            filter,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statFinanceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return (props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except))
    }, ({dispatch, filter}) => {
        dispatch(statFinanceInDataFetchAction(filter))
        dispatch(statFinanceOutDataFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense', 'value']) || null

            filter.filterBy({
                [STAT_FINANCE_FILTER_KEY.SEARCH]: search,
                [STAT_FINANCE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_FINANCE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_FINANCE_FILTER_KEY.TYPE]: type,
                [STAT_FINANCE_FILTER_KEY.CLIENT]: client,
                [STAT_FINANCE_FILTER_KEY.CATEGORY_EXPENSE]: categoryExpense
            })
        }
    })
)

const StatFinanceList = enhance((props) => {
    const {
        list,
        listLoading,
        filter,
        layout,
        graphIn,
        graphOut,
        graphInLoading,
        graphOutLoading,
        location
    } = props
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const type = !_.isNull(_.get(location, ['query', 'type'])) && _.toInteger(_.get(location, ['query', 'type']))
    const client = !_.isNull(_.get(location, ['query', 'client'])) && _.toInteger(_.get(location, ['query', 'client']))
    const categoryExpense = !_.isNull(_.get(location, ['query', 'categoryExpense'])) && _.toInteger(_.get(location, ['query', 'categoryExpense']))
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null

    const graphData = {
        dataIn: graphIn,
        dataOut: graphOut,
        graphOutLoading,
        graphInLoading
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const filterForm = {
        initialValues: {
            search: search,
            type: {
                value: type
            },
            client: {
                value: client
            },
            categoryExpense: {
                value: categoryExpense
            },
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }

    return (
        <Layout {...layout}>
            <StatFinanceGridList
                filter={filter}
                listData={listData}
                graphData={graphData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}

            />
        </Layout>
    )
})

export default StatFinanceList
