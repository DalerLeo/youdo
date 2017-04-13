import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import Marker from 'react-google-maps/lib/Marker'
import {withGoogleMap, GoogleMap as GoogleMapWrapper} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)
const GoogleMap = enhance((props) => {
    const {center, markers} = props
    return (
        <GoogleMapWrapper
            ref={_.noop}
            defaultZoom={15}
            radius="500"
            defaultCenter={center}
            onClick={_.noop}>
            {props.children}
            <Marker
                    position={markers}
            />
        </GoogleMapWrapper>
    )
})

GoogleMap.propTypes = {
    center: React.PropTypes.object.isRequired,
    markers: React.PropTypes.object.isRequired
}

export default GoogleMap
