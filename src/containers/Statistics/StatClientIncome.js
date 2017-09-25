import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'

import {ClientIncomeGridList} from '../../components/Statistics'
import {CLIENT_INCOME_FILTER_KEY} from '../../components/Statistics/ClientIncome/ClientIncomeGridList'

import {
    clientIncomeInDataFetchAction,
    clientIncomeOutDataFetchAction,
    clientIncomeListFetchAction
} from '../../actions/statClientIncome'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphIn = _.get(state, ['statClientIncome', 'dataIn', 'data'])
        const graphOut = _.get(state, ['statClientIncome', 'dataOut', 'data'])
        const graphInLoading = _.get(state, ['statClientIncome', 'dataIn', 'loading'])
        const graphOutLoading = _.get(state, ['statClientIncome', 'dataOut', 'loading'])
        const list = _.get(state, ['statClientIncome', 'list', 'data'])
        const listLoading = _.get(state, ['statClientIncome', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientIncomeFilterForm'])
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
        dispatch(clientIncomeListFetchAction(filter))
        dispatch(clientIncomeInDataFetchAction())
        dispatch(clientIncomeOutDataFetchAction())
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [CLIENT_INCOME_FILTER_KEY.SEARCH]: search,
                [CLIENT_INCOME_FILTER_KEY.TYPE]: type,
                [CLIENT_INCOME_FILTER_KEY.DIVISION]: division,
                [CLIENT_INCOME_FILTER_KEY.CLIENT]: client,
                [CLIENT_INCOME_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CLIENT_INCOME_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        }
    })
)

const ClientIncomeList = enhance((props) => {
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

    const lastDay = moment().daysInMonth()
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const division = !_.isNull(_.get(location, ['query', 'division'])) && _.toInteger(_.get(location, ['query', 'division']))
    const type = !_.isNull(_.get(location, ['query', 'type'])) && _.toInteger(_.get(location, ['query', 'type']))
    const client = !_.isNull(_.get(location, ['query', 'client'])) && _.toInteger(_.get(location, ['query', 'client']))

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
            },
            division: {
                value: division
            },
            type: {
                value: type
            },
            client: {
                value: client
            }
        }
    }

    return (
        <Layout {...layout}>
            <ClientIncomeGridList
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

export default ClientIncomeList
