import React from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-google-maps'
import GoogleMap from '../GoogleMap'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        mapWrapper: {
            margin: '1px -30px 0',
            height: '100%'
        }
    })
)

const ShopDetailsMap = enhance((props) => {
    const {classes, lat, lng} = props
    const center = {lat, lng}

    return (
        <div className={classes.mapWrapper}>
            <GoogleMap center={center} defaultZoom={19}>
                <Marker position={center} />
            </GoogleMap>
        </div>
    )
})

ShopDetailsMap.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
}

export default ShopDetailsMap

