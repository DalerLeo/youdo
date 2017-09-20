import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import sprintf from 'sprintf'
import * as ROUTER from '../../constants/routes'
import TrackingWrapper from '../../components/Tracking/TrackingWrapper'
import {OPEN_SHOP_DETAILS, USER_GROUP, DATE} from '../../components/Tracking'
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
const ONE = 1
const defaultDate = moment().format('YYYY-MM-DD')

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['tracking', 'list', 'data'])
        const listLoading = _.get(state, ['tracking', 'list', 'loading'])
        const detail = _.get(state, ['tracking', 'item', 'data'])
        const detailLoading = _.get(state, ['tracking', 'item', 'loading'])
        const agentLocation = _.get(state, ['tracking', 'location', 'data'])
        const agentLocationLoading = _.get(state, ['tracking', 'location', 'loading'])
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const filterForm = _.get(state, ['form', 'TrackingFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const isOpenTrack = toBoolean(_.get(query, 'agentTrack'))
        const isOpenMarkets = toBoolean(_.get(query, 'showMarkets'))
        const marketData = _.get(state, ['shop', 'item', 'data'])
        const marketDataLoading = _.get(state, ['shop', 'item', 'loading'])
        const selectedDate = _.get(query, DATE) || defaultDate

        return {
            query,
            pathname,
            filter,
            list,
            listLoading,
            detail,
            detailLoading,
            agentLocation,
            agentLocationLoading,
            marketsLocation,
            filterForm,
            isOpenTrack,
            isOpenMarkets,
            marketData,
            marketDataLoading,
            selectedDate
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(trackingListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevAgent = _.toInteger(_.get(props, ['params', 'agentId']))
        const nextAgent = _.toInteger(_.get(nextProps, ['params', 'agentId']))
        const prevDate = _.get(props, ['query', DATE])
        const nextDate = _.get(nextProps, ['query', DATE])
        const prevTrack = toBoolean(_.get(props, ['query', 'agentTrack']))
        const nextTrack = toBoolean(_.get(nextProps, ['query', 'agentTrack']))
        return (prevAgent !== nextAgent && nextAgent > ZERO) || (prevTrack !== nextTrack) || (prevDate !== nextDate)
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
        handleClickTab: props => (id) => {
            const {location: {pathname}, filter, selectedDate} = props
            if (_.toInteger(id)) {
                hashHistory.push({pathname, query: filter.getParams({[USER_GROUP]: id})})
            } else {
                hashHistory.push({pathname, query: {[DATE]: selectedDate}})
            }
        },

        handleOpenDetails: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.TRACKING_ITEM_PATH, id),
                query: filter.getParams({
                    // [TRACKING_FILTER_KEY.AGENT_TRACK]: true,
                    // [TRACKING_FILTER_KEY.DATE]: moment(date).format('YYYY-MM-DD')
                })
            })
        },

        handleOpenShopDetails: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_SHOP_DETAILS]: id})})
        },

        handleCloseShopDetails: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_SHOP_DETAILS]: ZERO})})
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
        },

        handlePrevDay: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const prevDay = moment(selectedDate).subtract(ONE, 'day')
            const dateForURL = prevDay.format('YYYY-MM-DD')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleNextDay: props => () => {
            const {location: {pathname}, filter, selectedDate} = props
            const nextDay = moment(selectedDate).add(ONE, 'day')
            const dateForURL = nextDay.format('YYYY-MM-DD')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
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
        agentLocationLoading,
        marketsLocation,
        isOpenTrack,
        isOpenMarkets,
        marketData,
        marketDataLoading,
        selectedDate,
        layout
    } = props

    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))
    const openShopDetails = _.toInteger(_.get(location, ['query', OPEN_SHOP_DETAILS]) || ZERO) > ZERO

    const groupId = _.toInteger(_.get(location, ['query', USER_GROUP])) || 'all'
    const showZones = toBoolean(filter.getParam(TRACKING_FILTER_KEY.SHOW_ZONES)) || false
    const showMarkets = toBoolean(filter.getParam(TRACKING_FILTER_KEY.SHOW_MARKETS)) || false
    const agentTrack = toBoolean(filter.getParam(TRACKING_FILTER_KEY.AGENT_TRACK)) || false
    const date = filter.getParam(TRACKING_FILTER_KEY.DATE)

    const currentDate = !_.isEmpty(date) ? date : moment().format('YYYY-MM-DD')
    const tabData = {
        groupId,
        handleClickTab: props.handleClickTab
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

    const minutePerHour = 60
    const current = (_.toInteger(moment().format('H')) * minutePerHour) + _.toInteger(moment().format('m'))
    const filterForm = {
        initialValues: {
            agentTrack: agentTrack,
            date: moment(currentDate).toDate(),
            time: current,
            showMarkets: showMarkets,
            showZones: showZones
        },
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const calendar = {
        selectedDate,
        handlePrevDay: props.handlePrevDay,
        handleNextDay: props.handleNextDay
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
                detailData={detailData}
                shopDetails={shopDetails}
                filterForm={filterForm}
                agentLocation={agentLocation}
                agentLocationLoading={agentLocationLoading}
                tabData={tabData}
                calendar={calendar}
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
