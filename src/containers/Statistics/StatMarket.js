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
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statProductSerializer'
import getDocuments from '../../helpers/getDocument'
import {
    statMarketListFetchAction,
    statMarketSumFetchAction,
    statMarketTypeListFetchAction
} from '../../actions/statMarket'

import {StatMarketGridList, STAT_MARKET_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_MARKET_FILTER_KEY, MARKET, MARKET_TYPE} from '../../components/Statistics/Markets/StatMarketGridList'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const sumData = _.get(state, ['statMarket', 'marketSum', 'data'])
        const sumLoading = _.get(state, ['statMarket', 'marketSum', 'loading'])
        const marketList = _.get(state, ['statMarket', 'marketList', 'data'])
        const marketListLoading = _.get(state, ['statMarket', 'marketList', 'loading'])
        const marketTypeList = _.get(state, ['statMarket', 'marketTypeList', 'data'])
        const marketTypeListLoading = _.get(state, ['statMarket', 'marketTypeList', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(marketList, pathname, query)
        return {
            marketList,
            marketListLoading,
            marketTypeList,
            marketTypeListLoading,
            filter,
            filterForm,
            sumLoading,
            sumData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest())
    }, ({dispatch, filter}) => {
        const toggle = filter.getParam('toggle') || MARKET
        return toggle === MARKET
            ? dispatch(statMarketListFetchAction(filter))
            : dispatch(statMarketTypeListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return (props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except))
    }, ({dispatch, filter}) => {
        dispatch(statMarketSumFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const user = _.get(filterForm, ['values', 'user']) || null
            const marketType = _.get(filterForm, ['values', 'marketType']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_MARKET_FILTER_KEY.SEARCH]: search,
                [STAT_MARKET_FILTER_KEY.USER]: joinArray(user),
                [STAT_MARKET_FILTER_KEY.MARKET_TYPE]: joinArray(marketType),
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
            const {filter, location: {query}} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            const toggle = _.get(query, 'toggle') || MARKET
            return toggle === MARKET_TYPE
                ? getDocuments(API.STAT_MARKET_TYPE_GET_DOCUMENT, params)
                : getDocuments(API.STAT_MARKET_GET_DOCUMENT, params)
        }
    })
)

const StatMarketList = enhance((props) => {
    const {
        location,
        marketList,
        marketListLoading,
        marketTypeList,
        marketTypeListLoading,
        filter,
        filterItem,
        filterForm,
        layout,
        params,
        sumData,
        sumLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statMarketId'))
    const openStatMarketDialog = toBoolean(_.get(location, ['query', STAT_MARKET_DIALOG_OPEN]))
    const marketType = _.get(location, ['query', STAT_MARKET_FILTER_KEY.MARKET_TYPE])
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const user = !_.isNull(_.get(location, ['query', 'user'])) && _.get(location, ['query', 'user'])
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null
    const toggle = filter.getParam('toggle') || MARKET

    const statMarketDialog = {
        openStatMarketDialog,
        handleCloseStatMarketDialog: props.handleCloseStatMarketDialog,
        handleOpenStatMarketDialog: props.handleOpenStatMarketDialog
    }

    const listData = {
        sumData: sumData,
        sumLoading: sumLoading,
        data: toggle === MARKET ? _.get(marketList, 'results') : _.get(marketTypeList, 'results'),
        listLoading: toggle === MARKET ? marketListLoading : marketTypeListLoading
    }
    const filterDateRange = {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']) || null,
        'toDate': _.get(filterForm, ['values', 'date', 'toDate']) || null
    }
    const detailData = {
        filter: filterItem,
        id: detailId,
        handleCloseDetail: props.handleCloseDetail,
        handleOpenDetail: props.handleOpenDetail,
        filterDateRange
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        search: search,
        marketType: marketType && splitToArray(marketType),
        user: user && splitToArray(user),
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
