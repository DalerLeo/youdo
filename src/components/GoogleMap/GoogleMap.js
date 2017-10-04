import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Marker} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import Market from '../Images/plan-market.png'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)

const GoogleMapWrapper = enhance(({onMapLoad, marketsLocation, ...props}) => {
    const markets = _.map(marketsLocation, (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const lat = _.get(item, ['location', 'coordinates', '0'])
        const lng = _.get(item, ['location', 'coordinates', '1'])

        return (
            <Marker
                key={id}
                position={{lat: lat, lng: lng}}
                title={name}
                options={
                {
                    icon: {
                        url: Market,
                        size: {width: 24, height: 24},
                        scaledSize: {width: 24, height: 24}
                    }
                }}>
            </Marker>
        )
    })
    return (
        <DefaultGoogleMap ref={onMapLoad} {...props}>
            {markets}
            {props.children}
        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const GoogleMap = (props) => {
    const {marketsLocation, ...defaultProps} = props
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
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

GoogleMap.propTypes = {
    onMapLoad: PropTypes.func
}

export default GoogleMap
