import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, Polyline, InfoWindow} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import moment from 'moment'
import PropTypes from 'prop-types'
import AgentOnline from '../Images/agent-online.png'
import AgentOffline from '../Images/agent-offline.png'
import Location from '../Images/market-location.png'
import MarketOff from '../Images/market-red.png'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import {connect} from 'react-redux'
import toBoolean from '../../helpers/toBoolean'

const ZERO = 0
const enhance = compose(
    withScriptjs,
    withGoogleMap,
    connect((state, props) => {
        const agentId = _.get(props, 'agentId')
        const timeValue = _.toInteger(_.get(state, ['form', 'TrackingFilterForm', 'values', 'time']))
        const date = _.get(state, ['form', 'TrackingFilterForm', 'values', 'date'])
        return {
            agentId,
            timeValue,
            date
        }
    }),
    withState('openMarketInfo', 'setOpenMarketInfo', ZERO),
    withState('openAgentInfo', 'setOpenAgentInfo', ZERO),
)
const GoogleMapWrapper = enhance(({
    onMapLoad,
    agentId,
    listData,
    handleOpenDetails,
    agentLocation,
    marketsLocation,
    openMarketInfo,
    setOpenMarketInfo,
    setOpenAgentInfo,
    shopDetails,
    timeValue,
    date,
    filter,
    ...props
    }) => {
    const minutePerHour = 60
    const TEN = 10
    let hour = _.floor(timeValue / minutePerHour) || ZERO
    if (hour < TEN) {
        hour = '0' + hour
    }
    let minute = _.floor(timeValue % minutePerHour) || ZERO
    if (minute < TEN) {
        minute = '0' + minute
    }
    const filterDate = _.toInteger(moment(moment(date).format('YYYY-MM-DD ' + hour + ':' + minute)).format('x'))

    const filterAgentLocation = _.filter(_.get(agentLocation, 'results'), (o) => {
        const regDate = _.toInteger(moment(_.get(o, 'registeredDate')).format('x'))
        return regDate <= filterDate
    })
    const agentCoordinates = [
        _.map(filterAgentLocation, (item) => {
            const lat = _.get(item, ['point', 'lat'])
            const lng = _.get(item, ['point', 'lon'])
            const registeredDate = _.get(item, 'registeredDate')
            return {
                lat: lat,
                lng: lng,
                date: moment(registeredDate).format('HH:mm:ss')
            }
        })
    ]
    const polyLineOptions = {
        strokeColor: 'rgba(25, 103, 126, 0.85)',
        strokeOpacity: 1,
        strokeWeight: 3
    }

    const clickMarket = (id) => {
        shopDetails.handleOpenShopDetails(id)
        setOpenMarketInfo(id)
    }

    const clickAgent = (id) => {
        handleOpenDetails(id)
        setOpenAgentInfo(id)
    }

    const showMarkets = toBoolean(_.get(filter.getParams(), 'showMarkets')) || false
    return (
        <DefaultGoogleMap
            ref={onMapLoad}
            defaultCenter={GOOGLE_MAP.DEFAULT_LOCATION}
            {...props}>
            <MarkerClusterer
                averageCenter
                enableRetinaIcons
                maxZoom={16}>
                {_.map(marketsLocation, (item) => {
                    const id = _.get(item, 'id')
                    const name = _.get(item, 'name')
                    const lat = _.get(item, ['location', 'coordinates', '0'])
                    const lng = _.get(item, ['location', 'coordinates', '1'])

                    const marker = (
                        <Marker
                            key={id}
                            onClick={() => { clickMarket(id) }}
                            position={{lat: lat, lng: lng}}
                            title={name}
                            options={
                            {
                                icon: {
                                    url: MarketOff,
                                    size: {width: 14, height: 14},
                                    scaledSize: {width: 14, height: 14}
                                }
                            }}>

                            {(id === openMarketInfo) && <InfoWindow>
                                <div>{name}</div>
                            </InfoWindow>}
                        </Marker>
                    )

                    if (showMarkets && !_.isEmpty(_.get(item, 'location'))) {
                        return marker
                    }
                    return false
                })}
            </MarkerClusterer>
                {_.map(listData, (item) => {
                    const id = _.get(item, 'id')
                    const name = _.get(item, 'agent')
                    const lat = _.get(item, ['location', 'lat'])
                    const lng = _.get(item, ['location', 'lon'])

                    const FIVE_MIN = 300000
                    const dateNow = _.toInteger(moment().format('x'))
                    const registeredDate = _.toInteger(moment(_.get(item, 'registeredDate')).format('x'))
                    const difference = dateNow - registeredDate
                    let isOnline = false
                    if (difference <= FIVE_MIN) {
                        isOnline = true
                    }
                    const lastLat = _.get(_.last(filterAgentLocation), ['point', 'lat'])
                    const lastLon = _.get(_.last(filterAgentLocation), ['point', 'lon'])
                    if (id === agentId) {
                        return (
                            <div>
                                <Marker
                                    key={id}
                                    onClick={() => { clickAgent(id) }}
                                    position={{lat: lastLat || lat, lng: lastLon || lng}}
                                    options={
                                    {
                                        zIndex: 999,
                                        icon: {
                                            url: isOnline ? AgentOnline : AgentOffline,
                                            zIndex: 999,
                                            size: {width: 30, height: 30},
                                            scaledSize: {width: 30, height: 30}
                                        }
                                    }}>
                                    <InfoWindow>
                                        <div>{name}</div>
                                    </InfoWindow>
                                </Marker>

                                <Polyline
                                    path={_.get(agentCoordinates, '0')}
                                    geodesic={true}
                                    options={polyLineOptions}
                                />
                                {_.map(_.get(agentCoordinates, '0'), (point, index) => {
                                    const trackLat = _.get(point, 'lat')
                                    const trackLng = _.get(point, 'lng')
                                    const regDate = _.get(point, 'date')
                                    return (
                                        <Marker
                                            key={index}
                                            position={{lat: trackLat, lng: trackLng}}
                                            title={regDate}
                                            options={
                                            {
                                                icon: {
                                                    url: Location,
                                                    size: {width: 30, height: 30},
                                                    scaledSize: {width: 8, height: 8},
                                                    anchor: {x: 4, y: 4}
                                                }
                                            }}>
                                        </Marker>
                                    )
                                })}
                            </div>
                        )
                    }

                    return false
                })}
            <MarkerClusterer>
                {_.map(listData, (item) => {
                    const id = _.get(item, 'id')
                    const name = _.get(item, 'agent')
                    const lat = _.get(item, ['location', 'lat'])
                    const lng = _.get(item, ['location', 'lon'])

                    const FIVE_MIN = 300000
                    const dateNow = _.toInteger(moment().format('x'))
                    const registeredDate = _.toInteger(moment(_.get(item, 'registeredDate')).format('x'))
                    const difference = dateNow - registeredDate
                    let isOnline = false
                    if (difference <= FIVE_MIN) {
                        isOnline = true
                    }
                    if (id !== agentId) {
                        return (
                            <Marker
                                key={id}
                                title={name}
                                onClick={() => { clickAgent(id) }}
                                position={{lat: lat, lng: lng}}
                                options={
                                {
                                    opacity: 0.7,
                                    icon: {
                                        url: isOnline ? AgentOnline : AgentOffline,
                                        size: {width: 30, height: 30},
                                        scaledSize: {width: 30, height: 30}
                                    }
                                }}>
                            </Marker>
                        )
                    }

                    return false
                })}
            </MarkerClusterer>
            {props.children}
        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4}/>
    </div>

const GoogleMap = (props) => {
    const {
        filter,
        agentId,
        listData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        shopDetails,
        ...defaultProps
    } = props

    const mapOptions = {
        styles: googleMapStyle,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: false,
        scaleControl: false,
        fullscreenControl: false
    }

    return (
        <GoogleMapWrapper
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}}/>}
            mapElement={<div style={{height: '100%'}}/>}
            options={mapOptions}
            defaultZoom={13}
            radius="500"

            filter={filter}
            agentId={agentId}
            listData={listData}
            handleOpenDetails={handleOpenDetails}
            agentLocation={agentLocation}
            marketsLocation={marketsLocation}
            shopDetails={shopDetails}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

GoogleMap.PropTypes = {
    listData: PropTypes.object,
    handleOpenDetails: PropTypes.func,
    agentLocation: PropTypes.object,
    marketsLocation: PropTypes.object,
    isOpenMarkets: PropTypes.bool,
    shopDetails: PropTypes.shape({
        openShopDetails: PropTypes.number.isRequired,
        handleOpenShopDetails: PropTypes.func.isRequired,
        handleCloseShopDetails: PropTypes.func.isRequired
    })
}

export default GoogleMap
