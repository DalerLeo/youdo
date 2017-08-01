import {
    default as React,
    Component
} from 'react'

import * as GOOGLE_MAP from '../../constants/googleMaps'

import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'

import {
    withGoogleMap,
    GoogleMap
} from 'react-google-maps'

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const GettingStartedGoogleMap = withScriptjs(withGoogleMap(({...props}) => (
    <GoogleMap
        {...props}
    >
    </GoogleMap>
)))

class GettingStartedExample extends Component {

    state = {
        markers: [{
            position: {
                lat: 25.0112183,
                lng: 121.52067570000001
            },
            key: 'Taiwan',
            defaultAnimation: 2
        }]
    }

    render () {
        return (
            <div style={{height: '100%'}}>
                <GettingStartedGoogleMap
                    defaultCenter={GOOGLE_MAP.DEFAULT_LOCATION}
                    googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
                    loadingElement={<Loader />}
                    containerElement={
                        <div style={{height: '100%'}} />
                    }
                    mapElement={
                        <div style={{height: '100%'}}/>
                    }
                    defaultZoom={15}
                    radius="500"
                    markers={this.state.markers}
                />
            </div>
        )
    }
}
export default GettingStartedExample
