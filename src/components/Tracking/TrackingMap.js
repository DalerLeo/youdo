import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, Polyline, InfoWindow} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import moment from 'moment'
import PropTypes from 'prop-types'
import RedPin from '../Images/person-pin-red.png'
import GreenPin from '../Images/person-pin-green.png'
import MarketLocation from '../Images/market-location.png'

const ZERO = 0
const enhance = compose(
    withScriptjs,
    withGoogleMap,
    withState('openMarketInfo', 'setOpenMarketInfo', ZERO)
)

const GoogleMapWrapper = enhance(({
        onMapLoad,
        listData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        isOpenTrack,
        isOpenMarkets,
        openMarketInfo,
        setOpenMarketInfo,
        ...props
    }) => {
    const agentCoordinates = [
        _.map(_.get(agentLocation, 'results'), (item) => {
            const lat = _.get(item, ['point', 'lat'])
            const lng = _.get(item, ['point', 'lon'])
            return {lat: lat, lng: lng}
        })
    ]
    const polyLineOptions = {
        strokeColor: '#19677e',
        strokeOpacity: 1,
        strokeWeight: 3
    }
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {_.map(marketsLocation, (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name')
                const lat = _.get(item, ['location', 'coordinates', '0'])
                const lng = _.get(item, ['location', 'coordinates', '1'])

                if (isOpenMarkets) {
                    return (
                        <Marker
                            key={id}
                            onClick={() => { setOpenMarketInfo(id) }}
                            position={{lat: lat, lng: lng}}
                            options={
                            {icon:
                            {url: MarketLocation,
                                size: {width: 15, height: 15},
                                scaledSize: {width: 15, height: 15}
                            }}}>

                            {(id === openMarketInfo) && <InfoWindow>
                                <div>{name}</div>
                            </InfoWindow>}
                        </Marker>
                    )
                }
                return false
            })}

            {_.map(listData, (item) => {
                const id = _.get(item, 'id')
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

                return (
                    <Marker
                        key={id}
                        onClick={() => { handleOpenDetails(id) }}
                        position={{lat: lat, lng: lng}}
                        options={
                        {icon:
                        {url: isOnline ? GreenPin : RedPin,
                            size: {width: 26, height: 30},
                            scaledSize: {width: 26, height: 30}
                        }}}>
                    </Marker>
                )
            })}
            {props.children}
            <Polyline
                path={isOpenTrack ? _.get(agentCoordinates, '0') : []}
                geodesic={true}
                options={polyLineOptions}
            />

        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const GoogleMap = (props) => {
    const {
        listData,
        handleOpenDetails,
        agentLocation,
        marketsLocation,
        isOpenTrack,
        isOpenMarkets,
        ...defaultProps
    } = props

    return (
        <GoogleMapWrapper
            defaultCenter={GOOGLE_MAP.DEFAULT_LOCATION}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={15}
            radius="500"
            listData={listData}
            handleOpenDetails={handleOpenDetails}
            agentLocation={agentLocation}
            marketsLocation={marketsLocation}
            isOpenTrack={isOpenTrack}
            isOpenMarkets={isOpenMarkets}
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
    isOpenTrack: PropTypes.bool,
    isOpenMarkets: PropTypes.bool
}

export default GoogleMap
