import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import sprintf from 'sprintf'
import * as ROUTER from '../../constants/routes'
import TrackingWrapper from '../../components/Tracking/TrackingWrapper'
import {TOGGLE_INFO, OPEN_SHOP_DETAILS} from '../../components/Tracking'
import toBoolean from '../../helpers/toBoolean'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    trackingListFetchAction,
    locationListAction,
    marketsLocationFetchAction
} from '../../actions/tracking'
import {shopItemFetchAction} from '../../actions/shop'

const TRACKING_FILTER_KEY = {
    DATE: 'date',
    SHOW_MARKETS: 'showMarkets',
    SHOW_ZONES: 'showZones',
    AGENT_TRACK: 'agentTrack'
}

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['tracking', 'list', 'data'])
        const listLoading = _.get(state, ['tracking', 'list', 'loading'])
        const detail = _.get(state, ['tracking', 'item', 'data'])
        const detailLoading = _.get(state, ['tracking', 'item', 'loading'])
        const agentLocation = _.get(state, ['tracking', 'location', 'data'])
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const filterForm = _.get(state, ['form', 'TrackingFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const isOpenTrack = toBoolean(_.get(query, 'agentTrack'))
        const isOpenMarkets = toBoolean(_.get(query, 'showMarkets'))
        const marketData = _.get(state, ['shop', 'item', 'data'])
        const marketDataLoading = _.get(state, ['shop', 'item', 'loading'])

        return {
            query,
            pathname,
            filter,
            list,
            listLoading,
            detail,
            detailLoading,
            agentLocation,
            marketsLocation,
            filterForm,
            isOpenTrack,
            isOpenMarkets,
            marketData,
            marketDataLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevToggle = toBoolean(_.get(props, ['query', 'openInfo']))
        const nextToggle = toBoolean(_.get(nextProps, ['query', 'openInfo']))
        return prevToggle !== nextToggle && nextToggle === true
    }, ({dispatch, filter}) => {
        dispatch(trackingListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevAgent = _.get(props, ['params', 'agentId'])
        const nextAgent = _.get(nextProps, ['params', 'agentId'])
        const prevDate = _.get(props, ['query', 'date'])
        const nextDate = _.get(nextProps, ['query', 'date'])
        const prevTrack = toBoolean(_.get(props, ['query', 'agentTrack']))
        const nextTrack = toBoolean(_.get(nextProps, ['query', 'agentTrack']))
        return (prevAgent !== nextAgent || prevTrack !== nextTrack || prevDate !== nextDate)
    }, ({dispatch, params, location}) => {
        const id = _.toInteger(_.get(params, 'agentId'))
        const serializerData = {
            date: _.get(location, ['query', 'date'])
        }
        if (id > ZERO) {
            dispatch(locationListAction(id, serializerData))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevMarket = toBoolean(_.get(props, ['query', 'showMarkets']))
        const nextMarket = toBoolean(_.get(nextProps, ['query', 'showMarkets']))
        return prevMarket !== nextMarket && nextMarket === true
    }, ({dispatch}) => {
        dispatch(marketsLocationFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const prevMarket = _.get(props, ['query', 'openShop'])
        const nextMarket = _.get(nextProps, ['query', 'openShop'])
        return prevMarket !== nextMarket && nextMarket > ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', 'openShop']))
        if (id > ZERO) {
            dispatch(shopItemFetchAction(id))
        }
    }),

    withHandlers({
        handleOpenDetails: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.TRACKING_ITEM_PATH, id), query: filter.getParams({[TOGGLE_INFO]: true})})
        },

        handleOpenShopDetails: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_SHOP_DETAILS]: id, [TOGGLE_INFO]: true})})
        },

        handleCloseShopDetails: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_SHOP_DETAILS]: ZERO})})
        },

        handleExpandInfo: props => () => {
            const {location: {pathname}, dispatch, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TOGGLE_INFO]: true})})

            return dispatch(trackingListFetchAction(filter))
        },

        handleCollapseInfo: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TOGGLE_INFO]: false})})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const showZones = _.get(filterForm, ['values', 'showZones']) || null
            const showMarkets = _.get(filterForm, ['values', 'showMarkets']) || null
            const agentTrack = _.get(filterForm, ['values', 'agentTrack']) || null
            const date = _.get(filterForm, ['values', 'date']) || null

            filter.filterBy({
                [TRACKING_FILTER_KEY.DATE]: moment(date).format('YYYY-MM-DD'),
                [TRACKING_FILTER_KEY.SHOW_MARKETS]: showMarkets,
                [TRACKING_FILTER_KEY.SHOW_ZONES]: showZones,
                [TRACKING_FILTER_KEY.AGENT_TRACK]: agentTrack
            })
        }
    })
)

const Tracking = enhance((props) => {
    const {
        location,
        params,
        filter,
        list,
        listLoading,
        detail,
        detailLoading,
        agentLocation,
        marketsLocation,
        isOpenTrack,
        isOpenMarkets,
        marketData,
        marketDataLoading,
        layout
    } = props

    const openToggle = toBoolean(_.get(location, ['query', TOGGLE_INFO]))
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))
    const openShopDetails = _.toInteger(_.get(location, ['query', OPEN_SHOP_DETAILS]) || ZERO) > ZERO

    const showZones = toBoolean(filter.getParam(TRACKING_FILTER_KEY.SHOW_ZONES)) || false
    const showMarkets = toBoolean(filter.getParam(TRACKING_FILTER_KEY.SHOW_MARKETS)) || false
    const agentTrack = toBoolean(filter.getParam(TRACKING_FILTER_KEY.AGENT_TRACK)) || false
    const date = filter.getParam(TRACKING_FILTER_KEY.DATE)

    let currentDate = moment().format('YYYY-MM-DD')
    if (date) {
        currentDate = date
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        openDetail,
        id: detailId,
        data: detail,
        detailLoading
    }

    const filterForm = {
        initialValues: {
            agentTrack: agentTrack,
            date: moment(currentDate).toDate(),
            time: 1440,
            showMarkets: showMarkets,
            showZones: showZones
        },
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const toggle = {
        openToggle,
        handleExpandInfo: props.handleExpandInfo,
        handleCollapseInfo: props.handleCollapseInfo
    }

    const shopDetails = {
        marketData,
        marketDataLoading,
        openShopDetails,
        handleOpenShopDetails: props.handleOpenShopDetails,
        handleCloseShopDetails: props.handleCloseShopDetails
    }

    return (
        <Layout {...layout}>
            <TrackingWrapper
                filter={filter}
                listData={listData}
                toggle={toggle}
                detailData={detailData}
                shopDetails={shopDetails}
                filterForm={filterForm}
                agentLocation={agentLocation}
                initialValues={filterForm.initialValues}
                marketsLocation={marketsLocation}
                handleOpenDetails={props.handleOpenDetails}
                isOpenTrack={isOpenTrack}
                isOpenMarkets={isOpenMarkets}
            />
        </Layout>
    )
})

export default Tracking
