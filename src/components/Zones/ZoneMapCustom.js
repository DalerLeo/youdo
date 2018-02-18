import _ from 'lodash'
import {default as React, Component} from 'react'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import Loader from '../Loader'
import {withGoogleMap, GoogleMap} from 'react-google-maps'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager'

const MapLoader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Loader size={0.75}/>
    </div>

const handleOverlayComplete = (event) => {
    const coordinates = event.overlay.getPath().getArray()
    return _.map(coordinates, (p) => {
        const polyLat = p.lat()
        const polyLng = p.lng()

        return {lat: polyLat, lng: polyLng}
    })
}

const GettingStartedGoogleMap = withScriptjs(withGoogleMap(({...props}) => (
    <GoogleMap {...props}>
        <DrawingManager
            deftest="a"
            defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
            onOverlayComplete={handleOverlayComplete}
            defaultOptions={{
                drawingControl: false,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                },
                polygonOptions: {
                    fillColor: '#199ee0',
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeColor: '#113460',
                    clickable: true,
                    draggable: true,
                    editable: true,
                    zIndex: 1
                }
            }}
        />
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
                    loadingElement={<MapLoader/>}
                    containerElement={
                        <div style={{height: '100%'}} />
                    }
                    mapElement={
                        <div style={{height: '100%'}}/>
                    }
                    defaultZoom={15}
                    defaultOptions={{styles: googleMapStyle}}
                    radius="500"
                    markers={this.state.markers}
                />
            </div>
        )
    }
}
export default GettingStartedExample
