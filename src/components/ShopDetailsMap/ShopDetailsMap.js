import React from 'react'
import {compose} from 'recompose'
import GoogleMap from '../GoogleMap'

const enhance = compose(
)

const ShopDetailsMap = enhance((props) => {
    const {lat, lng} = props
    const center = {lat: lat, lng: lng}
    return (
            <GoogleMap
                center={center}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg"
                loadingElement={
                    <div style={{height: '100%'}}>
                        Loading
                    </div>
                }
                containerElement={
                    <div style={{height: '100%'}} />
                }
                mapElement={
                    <div style={{height: '100%', borderRadius: '5px'}} />
                }
                markers={center}
            />
    )
})
ShopDetailsMap.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
}
export default ShopDetailsMap

