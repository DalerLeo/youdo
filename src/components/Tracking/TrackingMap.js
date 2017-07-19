import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, Polyline} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import moment from 'moment'
import PropTypes from 'prop-types'
import RedPin from '../Images/person-pin-red.png'
import GreenPin from '../Images/person-pin-green.png'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)

const GoogleMapWrapper = enhance((
    {
        onMapLoad,
        listData,
        handleOpenDetails,
        agentLocation,
        isOpenTrack,
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
                        }}}
                    />
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
        isOpenTrack,
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
            isOpenTrack={isOpenTrack}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

GoogleMap.PropTypes = {
    listData: PropTypes.object,
    handleOpenDetails: PropTypes.func,
    agentLocation: PropTypes.object,
    isOpenTrack: PropTypes.bool
}

export default GoogleMap
