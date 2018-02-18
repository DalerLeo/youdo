import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import getDocuments from '../../helpers/getDocument'
import * as serializers from '../../serializers/Statistics/statProviderTransactionsSerializer'
import * as API from '../../constants/api'

import {ProviderTransactionsGridList} from '../../components/Statistics'
import {PROVIDER_TRANSACTIONS_FILTER_KEY} from '../../components/Statistics/ProviderTransactions/ProviderTransactionsGridList'

import {
    providerTransactionsInDataFetchAction,
    providerTransactionsOutDataFetchAction,
    providerTransactionsListFetchAction
} from '../../actions/statProviderTransactions'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphIn = _.get(state, ['statProviderTransactions', 'dataIn', 'data'])
        const graphOut = _.get(state, ['statProviderTransactions', 'dataOut', 'data'])
        const graphInLoading = _.get(state, ['statProviderTransactions', 'dataIn', 'loading'])
        const graphOutLoading = _.get(state, ['statProviderTransactions', 'dataOut', 'loading'])
        const list = _.get(state, ['statProviderTransactions', 'list', 'data'])
        const listLoading = _.get(state, ['statProviderTransactions', 'list', 'loading'])
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
        dispatch(providerTransactionsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(providerTransactionsInDataFetchAction(filter))
        dispatch(providerTransactionsOutDataFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const type = _.get(filterForm, ['values', 'type']) || null
            const provider = _.get(filterForm, ['values', 'provider']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [PROVIDER_TRANSACTIONS_FILTER_KEY.SEARCH]: search,
                [PROVIDER_TRANSACTIONS_FILTER_KEY.TYPE]: joinArray(type),
                [PROVIDER_TRANSACTIONS_FILTER_KEY.DIVISION]: joinArray(division),
                [PROVIDER_TRANSACTIONS_FILTER_KEY.PROVIDER]: joinArray(provider),
                [PROVIDER_TRANSACTIONS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PROVIDER_TRANSACTIONS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_PROVIDER_TRANSACTIONS_GET_DOCUMENT, params)
        }
    })
)

const ProviderTransactionsList = enhance((props) => {
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
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null
    const division = !_.isNull(_.get(location, ['query', 'division'])) && _.get(location, ['query', 'division'])
    const type = !_.isNull(_.get(location, ['query', 'type'])) && _.get(location, ['query', 'type'])
    const provider = !_.isNull(_.get(location, ['query', 'provider'])) && _.get(location, ['query', 'provider'])

    let mergedGraph = {}

    _.map(graphIn, (item) => {
        mergedGraph[item.date] = {'in': item.amount, date: item.date}
    })

    _.map(graphOut, (item) => {
        if (mergedGraph[item.date]) {
            mergedGraph[item.date] = {'in': mergedGraph[item.date].in, 'out': item.amount, date: item.date}
        } else {
            mergedGraph[item.date] = {'in': 0, 'out': item.amount, date: item.date}
        }
    })

    const graphData = {
        dataIn: graphIn,
        dataOut: graphOut,
        mergedGraph: _.sortBy(mergedGraph, ['date']),
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
            search: search,
            division: division && splitToArray(division),
            provider: provider && splitToArray(provider),
            type: type && splitToArray(type)
        }
    }

    return (
        <Layout {...layout}>
            <ProviderTransactionsGridList
                filter={filter}
                listData={listData}
                graphData={graphData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                handleGetDocument={props.handleGetDocument}
            />
        </Layout>
    )
})

export default ProviderTransactionsList
