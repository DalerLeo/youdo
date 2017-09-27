import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statProductSerializer'
import getDocuments from '../../helpers/getDocument'
import {
    statMarketListFetchAction,
    statMarketDataFetchAction,
    statMarketSumFetchAction
} from '../../actions/statMarket'

import {StatMarketGridList, STAT_MARKET_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_MARKET_FILTER_KEY} from '../../components/Statistics/Markets/StatMarketGridList'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphList = _.get(state, ['statMarket', 'data', 'data'])
        const sumData = _.get(state, ['statMarket', 'sum', 'data'])
        const sumLoading = _.get(state, ['statMarket', 'sum', 'loading'])
        const graphLoading = _.get(state, ['statMarket', 'data', 'loading'])
        const list = _.get(state, ['statMarket', 'list', 'data'])
        const listLoading = _.get(state, ['statMarket', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            filter,
            filterForm,
            graphList,
            graphLoading,
            sumLoading,
            sumData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest())
    }, ({dispatch, filter}) => {
        dispatch(statMarketListFetchAction(filter))
        dispatch(statMarketSumFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statMarketId = _.get(nextProps, ['params', 'statMarketId']) || ZERO
        return statMarketId > ZERO && (_.get(props, ['params', 'statMarketId']) !== statMarketId)
    }, ({dispatch, params}) => {
        const statMarketId = _.toInteger(_.get(params, 'statMarketId'))
        if (statMarketId > ZERO) {
            dispatch(statMarketDataFetchAction(statMarketId))
        }
    }),
    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const user = _.get(filterForm, ['values', 'user', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_MARKET_FILTER_KEY.SEARCH]: search,
                [STAT_MARKET_FILTER_KEY.USER]: user,
                [STAT_MARKET_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_MARKET_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },

        handleOpenStatMarketDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATISTICS_MARKET_ITEM_PATH, id),
                query: filter.getParams({[STAT_MARKET_DIALOG_OPEN]: true})
            })
        },

        handleCloseStatMarketDialog: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STATISTICS_MARKET_URL,
                query: filter.getParams({[STAT_MARKET_DIALOG_OPEN]: false})
            })
        },
        handleOpenDetail: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_MARKET_ITEM_PATH, id), query: filter.getParams()})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_MARKET_URL, query: filter.getParams()})
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_MARKET_GET_DOCUMENT, params)
        }
    })
)

const StatMarketList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        filter,
        filterItem,
        filterForm,
        layout,
        params,
        graphList,
        graphLoading,
        sumData,
        sumLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statMarketId'))
    const openStatMarketDialog = toBoolean(_.get(location, ['query', STAT_MARKET_DIALOG_OPEN]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const user = !_.isNull(_.get(location, ['query', 'user'])) && _.toInteger(_.get(location, ['query', 'user']))
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null

    const statMarketDialog = {
        openStatMarketDialog,
        handleCloseStatMarketDialog: props.handleCloseStatMarketDialog,
        handleOpenStatMarketDialog: props.handleOpenStatMarketDialog
    }

    const listData = {
        sumData,
        sumLoading,
        data: _.get(list, 'results'),
        listLoading
    }
    const marketDetail = _.find(_.get(list, 'results'), (item) => {
        return _.toInteger(_.get(item, 'id')) === _.toInteger(detailId)
    })
    const filterDateRange = {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']) || null,
        'toDate': _.get(filterForm, ['values', 'date', 'toDate']) || null
    }
    const detailData = {
        filter: filterItem,
        id: detailId,
        marketDetail,
        graphList,
        graphLoading,
        handleCloseDetail: props.handleCloseDetail,
        handleOpenDetail: props.handleOpenDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        search: search,
        user: {
            value: user
        },
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }
    return (
        <Layout {...layout}>
            <StatMarketGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statMarketDialog={statMarketDialog}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
                filterItem={filterItem}
                initialValues={initialValues}
                filterForm={filterForm}
            />
        </Layout>
    )
})

export default StatMarketList
