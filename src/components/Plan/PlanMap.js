import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, OverlayView, Polyline} from 'react-google-maps'
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

const ONE = 1
const TWO = 2
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
        ...props
    }) => {
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
    const filteredPlanTracks = _.filter(plansPaths, (obj) => {
        return obj.length > ONE
    })
    const planTracks = _.map(filteredPlanTracks, (path, index) => {
        const polyLineOptions = {
            strokeColor: _.get(AGENT_COLORS, index),
            strokeOpacity: 1,
            strokeWeight: 4
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
            return (
                <Marker
                    key={i}
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
        const lat = _.get(item, ['location', 'coordinates', '0'])
        const lng = _.get(item, ['location', 'coordinates', '1'])

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
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {markets}
            {planTracks}
            {planAgentTracks}
            {props.children}
            {market && (selectedMarket !== market) && <OverlayView
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}
                position={{lat: _.get(marketForOverlay, ['location', 'coordinates', '0']), lng: _.get(marketForOverlay, ['location', 'coordinates', '1'])}}>
                <div className={classes.marketName}>{_.get(marketForOverlay, 'name')}</div>
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
        marketsLocation,
        handleChooseMarket,
        selectedMarket,
        plansPaths,
        plans,
        ...defaultProps
    } = props
    const defaultCenter = {
        lat: 41.311141,
        lng: 69.279716
    }
    return (
        <GoogleMapWrapper
            defaultCenter={defaultCenter}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={15}
            radius="500"
            defaultOptions={{styles: googleMapStyle}}
            marketsLocation={marketsLocation}
            handleChooseMarket={handleChooseMarket}
            selectedMarket={selectedMarket}
            plans={plans}
            plansPaths={plansPaths}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

PlanMap.propTypes = {
    onMapLoad: PropTypes.func
}

export default PlanMap
