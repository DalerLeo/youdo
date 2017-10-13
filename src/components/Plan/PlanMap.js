import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, OverlayView, Polyline, Polygon} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import injectSheet from 'react-jss'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import Market from '../Images/plan-market.png'
import MarketAdd from '../Images/plan-market-add.png'
import AgentPath1 from '../Images/agent-path-1.png'
import AgentPath2 from '../Images/agent-path-2.png'
import AgentPath3 from '../Images/agent-path-3.png'
import {AGENT_COLORS} from '../Plan'

const agentPaths = [AgentPath1, AgentPath2, AgentPath3]
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
        }
    }),
    withScriptjs,
    withGoogleMap,
    withState('market', 'updateMarket', null)
)

const ZERO = 0
const ONE = 1
const TWO = 2
const OPACITY = 0.4

const zoneOptions = {
    fillColor: 'transparent',
    strokeWeight: 2,
    strokeColor: '#607d8b'
}

const GoogleMapWrapper = enhance((
    {
        classes,
        onMapLoad,
        marketsLocation,
        handleChooseMarket,
        selectedMarket,
        market,
        updateMarket,
        plansPaths,
        plans,
        zoneAgents,
        selectedAgent,
        handleUpdateAgentPlan,
        zoneCoordinates,
        ...props
    }) => {
    const indexOfSelectedAgent = _.findIndex(zoneAgents, (o) => {
        return o.id === selectedAgent
    })
    const marketForOverlay = _.find(marketsLocation, {'id': market})
    const hoverMarker = (marketId) => {
        updateMarket(marketId)
    }
    const mouseOutMarker = () => {
        updateMarket(null)
    }
    const getPixelPositionOffset = (width, height) => ({
        x: -(width / TWO)
    })
    const planTracks = _.map(plansPaths, (path, index) => {
        const polyLineOptions = (index === indexOfSelectedAgent)
        ? {
            strokeColor: _.get(AGENT_COLORS, index),
            strokeOpacity: ONE,
            strokeWeight: 4,
            zIndex: 10
        }
        : {
            strokeColor: _.get(AGENT_COLORS, index),
            strokeOpacity: OPACITY,
            strokeWeight: 4,
            zIndex: 9
        }
        return (
            <Polyline
                key={index}
                path={path}
                geodesic={true}
                options={polyLineOptions}
            />
        )
    })
    const planAgentTracks = _.map(plansPaths, (obj, index) => {
        const dots = _.map(obj, (dot, i) => {
            const marketId = _.get(dot, 'marketId')
            const agentId = _.get(dot, 'agentId')
            const planId = _.get(dot, 'planId')
            return (
                <Marker
                    key={i}
                    opacity={(index === indexOfSelectedAgent) ? ONE : OPACITY}
                    onClick={() => { handleUpdateAgentPlan(planId, agentId, marketId) }}
                    onMouseOver={() => { hoverMarker(marketId) }}
                    onMouseOut={mouseOutMarker}
                    position={{lat: dot.lat, lng: dot.lng}}
                    options={
                    {
                        icon: {
                            url: _.get(agentPaths, index),
                            size: {width: 40, height: 40},
                            scaledSize: {width: 16, height: 16},
                            anchor: {x: 8, y: 8}
                        }
                    }}>
                </Marker>
            )
        })
        return (
            <div key={index}>
                {dots}
            </div>
        )
    })
    const mergeArrays = (arrayToUnion) => {
        let a = []
        _.map(arrayToUnion, (item) => {
            a = _.union(a, item)
        })
        return a
    }
    const mergedMarkets = mergeArrays(plans)
    const remainMarkets = _.differenceBy(marketsLocation, mergedMarkets, 'id')

    const markets = _.map(remainMarkets, (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const lat = _.get(item, ['location', 'lat'])
        const lng = _.get(item, ['location', 'lon'])

        if (id === selectedMarket) {
            return (
                <div key={id}>
                    <Marker
                        position={{lat: lat, lng: lng}}
                        onClick={() => { handleChooseMarket(id) }}
                        options={
                        {
                            icon: {
                                url: MarketAdd,
                                size: {width: 34, height: 34},
                                scaledSize: {width: 34, height: 34},
                                anchor: {x: 17, y: 17}
                            }
                        }}>
                    </Marker>
                    <OverlayView
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}
                        position={{lat: lat, lng: lng}}>
                        <div className={classes.marketInfo}>
                            <h4>Магазин</h4>
                            <div>{name}</div>
                        </div>
                    </OverlayView>
                </div>
            )
        }
        return (
            <Marker
                key={id}
                onMouseOver={() => { hoverMarker(id) }}
                onMouseOut={mouseOutMarker}
                position={{lat: lat, lng: lng}}
                onClick={() => { handleChooseMarket(id) }}
                options={
                {
                    icon: {
                        url: Market,
                        size: {width: 24, height: 24},
                        scaledSize: {width: 24, height: 24},
                        anchor: {x: 12, y: 12}
                    }
                }}>
            </Marker>
        )
    })
    const selectedZone = (
        <Polygon
            paths={zoneCoordinates}
            options={zoneOptions}
        />
    )
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {markets}
            {selectedZone}
            {selectedAgent > ZERO && planTracks}
            {selectedAgent > ZERO && planAgentTracks}
            {props.children}
            {market && (selectedMarket !== market) && <OverlayView
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}
                position={{lat: _.get(marketForOverlay, ['location', 'lat']), lng: _.get(marketForOverlay, ['location', 'lon'])}}>
                <div className={classes.marketName}>
                    <div><strong>Магазин:</strong> {_.get(marketForOverlay, 'name')}</div>
                    <div><strong>Адрес:</strong> {_.get(marketForOverlay, 'address')}</div>
                </div>
            </OverlayView>}
        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const PlanMap = (props) => {
    const {
        meanCenter,
        marketsLocation,
        handleChooseMarket,
        selectedMarket,
        plansPaths,
        plans,
        zoneAgents,
        selectedAgent,
        handleUpdateAgentPlan,
        zoneCoordinates,
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
            defaultCenter={meanCenter}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={13}
            radius="500"
            options={mapOptions}
            marketsLocation={marketsLocation}
            handleChooseMarket={handleChooseMarket}
            selectedMarket={selectedMarket}
            plans={plans}
            plansPaths={plansPaths}
            zoneAgents={zoneAgents}
            selectedAgent={selectedAgent}
            handleUpdateAgentPlan={handleUpdateAgentPlan}
            zoneCoordinates={zoneCoordinates}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

PlanMap.propTypes = {
    onMapLoad: PropTypes.func
}

export default PlanMap
