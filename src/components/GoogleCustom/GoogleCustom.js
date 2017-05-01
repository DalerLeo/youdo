/* global google */
import React from 'react'
import PropTypes from 'prop-types'
import {MAP} from 'react-google-maps/src/lib/constants'

class GoogleCustom extends React.Component {
    DOM = null

    componentDidMount () {
        const map = this.context[MAP]
        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['circle', 'polyline']
            },
            markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        })
        drawingManager.setMap(map)
    }

    render () {
        return this.DOM
    }
}

GoogleCustom.contextTypes = {
    [MAP]: PropTypes.object
}

export default GoogleCustom
