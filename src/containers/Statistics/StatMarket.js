import _ from 'lodash'
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
    statMarketItemFetchAction
} from '../../actions/statMarket'

import {StatMarketGridList, STAT_MARKET_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_MARKET_FILTER_KEY} from '../../components/Statistics/StatMarketGridList'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statMarket', 'item', 'data'])
        const detailLoading = _.get(state, ['statMarket', 'item', 'loading'])
        const list = _.get(state, ['statMarket', 'list', 'data'])
        const listLoading = _.get(state, ['statMarket', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatMarketFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterItem,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) &&
            (!_.get(props, ['params', 'statMarketId'])) &&
            (!_.get(nextProps, ['params', 'statMarketId']))
    }, ({dispatch, filter}) => {
        dispatch(statMarketListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statMarketId = _.get(nextProps, ['params', 'statMarketId']) || ZERO
        return statMarketId > ZERO && _.get(props, ['params', 'statMarketId']) !== statMarketId
    }, ({dispatch, params, filter, filterItem}) => {
        const statMarketId = _.toInteger(_.get(params, 'statMarketId'))
        if (statMarketId > ZERO) {
            dispatch(statMarketItemFetchAction(filter, filterItem, statMarketId))
        }
    }),
    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_MARKET_FILTER_KEY.SEARCH]: search,
                [STAT_MARKET_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_MARKET_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },

        handleOpenStatMarketDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_MARKET_ITEM_PATH, id), query: filter.getParams({[STAT_MARKET_DIALOG_OPEN]: true})})
        },

        handleCloseStatMarketDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_MARKET_URL, query: filter.getParams({[STAT_MARKET_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
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
        detail,
        detailLoading,
        filter,
        filterItem,
        filterForm,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statMarketId'))
    const openStatMarketDialog = toBoolean(_.get(location, ['query', STAT_MARKET_DIALOG_OPEN]))

    const statMarketDialog = {
        openStatMarketDialog,
        handleCloseStatMarketDialog: props.handleCloseStatMarketDialog,
        handleOpenStatMarketDialog: props.handleOpenStatMarketDialog
    }

    const listData = {
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
        data: detail,
        marketDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
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
            />
        </Layout>
    )
})

export default StatMarketList
