import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import Loader from '../Loader'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import {googleMapStyle} from '../../constants/googleMapsStyle'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)

const GoogleMapWrapper = enhance(({onMapLoad, ...props}) => {
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {props.children}
        </DefaultGoogleMap>
    )
})

const MapLoader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Loader size={0.75}/>
    </div>

const GoogleMap = (props) => {
    const {marketsLocation, handleChooseMarket, selectedMarket, ...defaultProps} = props
    const defaultCenter = {
        lat: 41.311141,
        lng: 69.279716
    }
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
            defaultCenter={defaultCenter}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<MapLoader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={15}
            radius="500"
            options={mapOptions}
            marketsLocation={marketsLocation}
            handleChooseMarket={handleChooseMarket}
            selectedMarket={selectedMarket}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

GoogleMap.propTypes = {
    onMapLoad: PropTypes.func
}

export default GoogleMap
