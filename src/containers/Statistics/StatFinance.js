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
        const filterForm = _.get(state, ['form', 'StatFinanceFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
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
        dispatch(statFinanceInDataFetchAction())
        dispatch(statFinanceOutDataFetchAction())
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_FINANCE_FILTER_KEY.SEARCH]: search,
                [STAT_FINANCE_FILTER_KEY.DIVISION]: division,
                [STAT_FINANCE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_FINANCE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

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
