import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import {
    withGoogleMap,
    GoogleMap as DefaultGoogleMap,
    Marker,
    Polyline,
    Polygon,
    OverlayView
} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import Loader from '../Loader'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import moment from 'moment'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import AgentOnline from '../Images/agent-online.png'
import AgentOffline from '../Images/agent-offline.png'
import Location from '../Images/market-location.png'
import MarketOff from '../Images/market-red.png'
import MarketOn from '../Images/market-green.png'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import {connect} from 'react-redux'
import toBoolean from '../../helpers/toBoolean'
import {isAgentOnline} from './TrackingWrapper'

const ZERO = 0
const TWO = 2
const enhance = compose(
    injectSheet({
        marketName: {
            background: '#fff',
            borderRadius: '2px',
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '13px',
            padding: '5px 20px',
            marginTop: '20px',
            whiteSpace: 'nowrap',
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
        },
        marketInfo: {
            extend: 'marketName',
            padding: '10px 20px',
            '& h4': {
                fontWeight: '600',
                fontSize: '13px'
            }
        },
        zoneName: {
            extend: 'marketName',
            zIndex: '50',
            fontSize: '15px',
            boxShadow: 'none',
            border: '1px #dadada solid'
        }
    }),
    withScriptjs,
    withGoogleMap,
    connect((state, props) => {
        const agentId = _.get(props, 'agentId')
        const date = _.get(state, ['form', 'TrackingFilterForm', 'values', 'date'])
        return {
            agentId,
            date
        }
    }),
    withState('openMarketInfo', 'setOpenMarketInfo', ZERO),
    withState('openAgentInfo', 'setOpenAgentInfo', ZERO),
)
const GoogleMapWrapper = enhance(({
        classes,
        onMapLoad,
        agentId,
        listData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        zonesLocation,
        openMarketInfo,
        openAgentInfo,
        setOpenMarketInfo,
        setOpenAgentInfo,
        shopDetails,
        sliderValue,
        date,
        filter,
        ...props
    }) => {
    const polygonOptions = {
        fillColor: '#199ee0',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#113460'
    }
    const overlayZonesOffset = (width, height) => {
        return {
            x: -(width / TWO),
            y: -(height / TWO)
        }
    }

    const minutePerHour = 60
    const TEN = 10
    const hourSlider = _.floor(sliderValue / minutePerHour) || ZERO
    const hour = hourSlider < TEN ? '0' + hourSlider : hourSlider

    const minuteSlider = _.floor(sliderValue % minutePerHour) || ZERO
    const minute = minuteSlider < TEN ? '0' + minuteSlider : minuteSlider
    const filterDate = _.toInteger(moment(moment(date).format('YYYY-MM-DD ' + hour + ':' + minute)).format('x'))

    const filterAgentLocation = _.filter(_.get(agentLocation, 'results'), (o) => {
        const regDate = _.toInteger(moment(_.get(o, 'locationDate')).format('x'))
        return regDate <= filterDate
    })
    const agentCoordinates = _.map(filterAgentLocation, (item) => {
        const lat = _.get(item, ['point', 'lat'])
        const lng = _.get(item, ['point', 'lon'])
        const registeredDate = _.get(item, 'locationDate')
        return {
            lat,
            lng,
            date: moment(registeredDate).format('HH:mm:ss')
        }
    })
    const zones = _.map(zonesLocation, (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')
        const point = _.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => {
            const lat = _.get(p, '0')
            const lng = _.get(p, '1')

            return {
                lat,
                lng
            }
        })

        const meanLat = _.mean(_.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => _.get(p, '0')))
        const meanLng = _.mean(_.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => _.get(p, '1')))
        return (
            <div key={id}>
                <Polygon
                    paths={point}
                    options={polygonOptions}
                />
                <OverlayView
                    position={{lat: meanLat, lng: meanLng}}
                    getPixelPositionOffset={overlayZonesOffset}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <div style={{textAlign: 'center'}}>
                        <div className={classes.zoneName}>{title}</div>
                    </div>
                </OverlayView>
            </div>
        )
    })
    const polyLineOptions = {
        strokeColor: 'rgba(25, 103, 126, 0.85)',
        strokeOpacity: 1,
        strokeWeight: 3
    }

    const hoverMarket = (id) => setOpenMarketInfo(id)
    const mouseOutMarket = () => setOpenMarketInfo(ZERO)

    const hoverAgent = (id) => setOpenAgentInfo(id)
    const mouseOutAgent = () => setOpenAgentInfo(ZERO)
    const getPixelPositionOffset = (width, height) => ({
        x: -(width / TWO)
    })

    const showMarkets = toBoolean(_.get(filter.getParams(), 'showMarkets')) || false
    const showZones = toBoolean(_.get(filter.getParams(), 'showZones')) || false
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
                    const isActive = _.get(item, 'isActive')
                    const lat = _.get(item, ['location', 'lat'])
                    const lng = _.get(item, ['location', 'lon'])

                    const marker = (
                        <Marker
                            key={id}
                            onClick={() => { shopDetails.handleOpenShopDetails(id) }}
                            onMouseOver={() => { hoverMarket(id) }}
                            onMouseOut={mouseOutMarket}
                            position={{lat: lat, lng: lng}}
                            options={
                            {
                                icon: {
                                    url: isActive ? MarketOn : MarketOff,
                                    size: {width: 14, height: 14},
                                    scaledSize: {width: 14, height: 14}
                                }
                            }}>

                            {(id === openMarketInfo) &&
                            <OverlayView
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                position={{lat: lat, lng: lng}}
                                getPixelPositionOffset={getPixelPositionOffset}>
                                <div className={classes.marketName}>{name}</div>
                            </OverlayView>}
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

                const registeredDate = _.toInteger(moment(_.get(item, 'locationDate')).format('x'))
                const isOnline = isAgentOnline(registeredDate)

                const lastLat = _.get(_.last(filterAgentLocation), ['point', 'lat'])
                const lastLon = _.get(_.last(filterAgentLocation), ['point', 'lon'])
                if (id === agentId) {
                    return (
                        <div key={id}>
                            <Marker
                                onClick={() => { handleOpenDetails(id) }}
                                onMouseOver={() => { hoverAgent(id) }}
                                onMouseOut={mouseOutAgent}
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
                                <OverlayView
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    position={{lat: lastLat || lat, lng: lastLon || lng}}
                                    getPixelPositionOffset={getPixelPositionOffset}>
                                    <div className={classes.marketName}>{name}</div>
                                </OverlayView>
                            </Marker>

                            <Polyline
                                path={agentCoordinates}
                                geodesic={true}
                                options={polyLineOptions}
                            />
                            {_.map(agentCoordinates, (point, index) => {
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

                    const registeredDate = _.toInteger(moment(_.get(item, 'locationDate')).format('x'))
                    const isOnline = isAgentOnline(registeredDate)
                    if (id !== agentId) {
                        return (
                            <div key={id}>
                                <Marker
                                    onClick={() => { handleOpenDetails(id) }}
                                    onMouseOver={() => { hoverAgent(id) }}
                                    onMouseOut={mouseOutAgent}
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
                                {(id === openAgentInfo) &&
                                <OverlayView
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    position={{lat: lat, lng: lng}}
                                    getPixelPositionOffset={getPixelPositionOffset}>
                                    <div className={classes.marketName}>{name}</div>
                                </OverlayView>}
                            </div>
                        )
                    }

                    return false
                })}
            </MarkerClusterer>
            {(showZones && agentId === ZERO) ? zones : null}
            {props.children}
        </DefaultGoogleMap>
    )
})

const MapLoader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Loader size={0.75}/>
    </div>

const GoogleMap = (props) => {
    const {
        filter,
        agentId,
        listData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        zonesLocation,
        shopDetails,
        sliderValue,
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
            loadingElement={<MapLoader/>}
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
            zonesLocation={zonesLocation}
            shopDetails={shopDetails}
            sliderValue={sliderValue}
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
