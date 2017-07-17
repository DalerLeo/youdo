import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import sprintf from 'sprintf'
import * as ROUTER from '../../constants/routes'
import TrackingWrapper from '../../components/Tracking/TrackingWrapper'
import {TOGGLE_INFO, TRACKING_FILTER_KEY} from '../../components/Tracking'
import toBoolean from '../../helpers/toBoolean'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    trackingListFetchAction,
    locationListAction
} from '../../actions/tracking'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['tracking', 'list', 'data'])
        const listLoading = _.get(state, ['tracking', 'list', 'loading'])
        const detail = _.get(state, ['tracking', 'item', 'data'])
        const detailLoading = _.get(state, ['tracking', 'item', 'loading'])
        const agentLocation = _.get(state, ['tracking', 'location', 'data'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            pathname,
            filter,
            list,
            listLoading,
            detail,
            detailLoading,
            agentLocation
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevToggle = toBoolean(_.get(props, ['query', 'openInfo']))
        const nextToggle = toBoolean(_.get(nextProps, ['query', 'openInfo']))
        return prevToggle !== nextToggle && nextToggle === true
    }, ({dispatch, filter}) => {
        dispatch(trackingListFetchAction(filter))
    }),

    withHandlers({
        handleOpenDetails: props => (id) => {
            const {dispatch, filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.TRACKING_ITEM_PATH, id), query: filter.getParams({[TOGGLE_INFO]: true})})

            return dispatch(locationListAction(id, filter))
        },

        handleAgentTrack: props => (id) => {
            const {dispatch, filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.TRACKING_ITEM_PATH, id), query: filter.getParams({[TOGGLE_INFO]: true})})

            return dispatch(locationListAction(id))
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
            const showZones = _.get(filterForm, ['values', 'showZones', 'value']) || null
            const showMarkets = _.get(filterForm, ['values', 'showMarkets', 'value']) || null
            const agentTrack = _.get(filterForm, ['values', 'agentTrack', 'value']) || null
            const agent = _.get(filterForm, ['values', 'agent', 'value']) || null
            const zone = _.get(filterForm, ['values', 'border', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'period', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'period', 'toDate']) || null

            filter.filterBy({
                [TRACKING_FILTER_KEY.PERIOD_FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [TRACKING_FILTER_KEY.PERIOD_TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [TRACKING_FILTER_KEY.ZONE]: zone,
                [TRACKING_FILTER_KEY.AGENT]: agent,
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
        layout
    } = props

    const openToggle = toBoolean(_.get(location, ['query', TOGGLE_INFO]))
    const openDetail = !_.isEmpty(_.get(params, 'agentId'))
    const detailId = _.toInteger(_.get(params, 'agentId'))

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

    const toggle = {
        openToggle,
        handleExpandInfo: props.handleExpandInfo,
        handleCollapseInfo: props.handleCollapseInfo
    }
    const jasur = {
        date: moment(moment().format('YYYY-MM-DD')).toDate()
    }

    return (
        <Layout {...layout}>
            <TrackingWrapper
                filter={filter}
                listData={listData}
                initialValues={jasur}
                toggle={toggle}
                detailData={detailData}
                agentLocation={agentLocation}
                handleOpenDetails={props.handleOpenDetails}
                handleAgentTrack={props.handleAgentTrack}
            />
        </Layout>
    )
})

export default Tracking
