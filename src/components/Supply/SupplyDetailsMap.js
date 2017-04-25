import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-google-maps'
import GoogleMap from '../GoogleMap'

const SupplyDetailsMap = (props) => {
    const {lat, lng} = props
    const center = {lat, lng}

    return (
        <GoogleMap center={center} defaultZoom={19}>
            <Marker position={center} />
        </GoogleMap>
    )
}

SupplyDetailsMap.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
}

export default SupplyDetailsMap

