import React from 'react'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'

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

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={80} thickness={5} />
    </div>

const GoogleMap = (props) => {
    const {...defaultProps} = props

    return (
        <GoogleMapWrapper
            defaultCenter={{lat: -34.397, lng: 150.644}}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={15}
            radius="500"
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

export default GoogleMap
