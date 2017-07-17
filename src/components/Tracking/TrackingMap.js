import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker, Polyline} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import PropTypes from 'prop-types'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)

const GoogleMapWrapper = enhance(({onMapLoad, listData, handleOpenDetails, agentLocation, handleAgentTrack, ...props}) => {
    const agentCoordinates = [
        _.map(_.get(agentLocation, 'results'), (item) => {
            const lat = _.get(item, ['point', 'lat'])
            const lng = _.get(item, ['point', 'lon'])
            return {lat: lat, lng: lng}
        })
    ]
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {_.map(listData, (item) => {
                const id = _.get(item, 'id')
                const lat = _.get(item, ['location', 'lat'])
                const lng = _.get(item, ['location', 'lon'])
                return (
                    <Marker
                        key={id}
                        onClick={() => { handleAgentTrack(id) }}
                        position={{lat: lat, lng: lng}}
                    />
                )
            })}
            {props.children}
            <Polyline
                path={_.get(agentCoordinates, '0')}
                geodesic={true}
                strokeColor='#12aaeb'
                strokeOpacity={1.0}
                strokeWeight={2}
            />

        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const GoogleMap = (props) => {
    const {listData, handleOpenDetails, agentLocation, handleAgentTrack, ...defaultProps} = props

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
            handleAgentTrack={handleAgentTrack}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

GoogleMap.PropTypes = {
    listData: PropTypes.object,
    handleOpenDetails: PropTypes.func,
    handleAgentTrack: PropTypes.func,
    agentLocation: PropTypes.object
}

export default GoogleMap
