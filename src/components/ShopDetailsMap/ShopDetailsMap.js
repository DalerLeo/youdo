import React from 'react'
import {compose} from 'recompose'
import GoogleMap from '../GoogleMap'
// import Loading from '../Loading'

const enhance = compose(
)
// const ShopDetails = enhance((props) => {
const ShopDetailsMap = enhance((props) => {
    const {lat, lng} = props
    const center = {lat: lat, lng: lng}
    console.log(center)
    // if (loading) {
    //     return (
    //         <div className={classes.loader}>
    //             <div>
    //                 <CircularProgress size={100} thickness={6} />
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div style={{width: '100%', height: '400px'}}>
            <GoogleMap
                center={center}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg"
                loadingElement={
                    <div style={{height: '100%'}}>
                        {/*<Loading/>*/}
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
        </div>
    )
})
ShopDetailsMap.propTypes = {
    // loading: React.PropTypes.bool.isRequired,
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
}
export default ShopDetailsMap

