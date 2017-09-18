/* eslint no-undef: 0 */
/* eslint no-new: 0 */
/* eslint no-unused-vars: 0 */

import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import CircularProgress from 'material-ui/CircularProgress'
import AddZonePopup from './AddZonePopup'
import ZoneDeleteDialog from './ZoneDeleteDialog'
import {googleMapStyle} from '../../constants/googleMapsStyle'
const ZERO = 0
const classes = {
    loader: {
        width: '100%',
        height: '100%',
        background: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    }
}

export default class GoogleCustomMap extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            center: null,
            drawing: null,
            zone: [],
            points: null,
            isDrawing: false,
            overlay: null
        }

        this.handleClearDrawing = this.handleClearDrawing.bind(this)
        this.handleDeleteZone = this.handleDeleteZone.bind(this)
        this.getUpdatedZone = this.getUpdatedZone.bind(this)
    }

    handleScriptCreate () {
        this.setState({
            scriptLoaded: false
        })
    }

    handleScriptError () {
        this.setState({
            scriptError: true
        })
    }

    handleScriptLoad () {
        this.setState({
            scriptLoaded: true
        })

        this.map = this.createMap()
        this.createZones()
    }

    handleClearDrawing () {
        google.maps.event.clearInstanceListeners(this.state.drawing)
        this.state.drawing.setMap(null)
    }

    handleDrawing () {
        if (this.state.drawing) {
            this.state.drawing.setMap(this.map)
            this.setState({
                isDrawing: true
            })
        }
    }

    handleEdit () {
        if (this.state.drawing) {
            this.state.drawing.setMap(null)
            this.setState({
                isDrawing: false
            })
        }
    }

    getMarkers () {
        let locations = [
            {lat: -31.563910, lng: 147.154312},
            {lat: -33.718234, lng: 150.363181},
            {lat: -43.999792, lng: 170.463352}
        ]
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let markers = locations.map((location, i) => {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length],
                map: this.map
            })
        })

        new MarkerClusterer(this.map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
    }

    createMap () {
        const mapOptions = {
            zoom: 13,
            center: GOOGLE_MAP.DEFAULT_LOCATION,
            mapTypeId: 'terrain',
            styles: googleMapStyle
        }
        const googl = new google.maps.Map(this.refs.mapping, mapOptions)
        this.map = googl
        return googl
    }

    createZones () {
        let zones = []
        _.map(_.get(this.props, ['listData', 'data']), (item) => {
            const id = _.get(item, 'id')
            const title = _.get(item, 'title')
            const point = _.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => {
                const lat = _.get(p, '0')
                const lng = _.get(p, '1')

                return {lat: lat, lng: lng}
            })
            const meanLat = _.mean(_.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => {
                return _.get(p, '0')
            }))
            const meanLng = _.mean(_.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => {
                return _.get(p, '1')
            }))
            const existingZone = new google.maps.Polygon({
                paths: point,
                fillColor: '#199ee0',
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: '#113460',
                clickable: false,
                draggable: false,
                zIndex: 1
            })
            zones.push({zone: existingZone, id, title})

            existingZone.setMap(this.map)
        })

        new google.maps.Marker({
            position: GOOGLE_MAP.DEFAULT_LOCATION,
            map: this.map
        })

        this.setState({
            zone: zones,
            drawing: new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polygon']
                },
                polygonOptions: {
                    fillColor: '#199ee0',
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeColor: '#113460',
                    clickable: true,
                    draggable: false,
                    editable: false,
                    zIndex: 1
                }
            })
        })
    }

    createOverlays (meanLat, meanLng, title) {
        this.overlayView = new google.maps.OverlayView()
        this.overlayView.setMap(this.map)
        this.overlayView.onAdd = () => {
            let containerElement = document.createElement('div')
            containerElement.style.borderStyle = 'none'
            containerElement.style.borderWidth = '0px'
            containerElement.style.position = 'absolute'

            return containerElement
        }
        this.overlayView.draw = () => {
            let overlayEl = this.overlayView
            let mapPanes = overlayEl.getPanes()
            let mapCanvasProjection = overlayEl.getProjection()
            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(meanLat, meanLng))
            let sw = mapCanvasProjection.fromLatLngToDivPixel(bounds.getCenter())
            let div = overlayEl.onAdd()
            div.style.left = sw.x + 'px'
            div.style.top = sw.y + 'px'
            div.style.color = 'red'
            div.innerHTML = title
            let mapPaneName = 'overlayLayer'
            mapPanes[mapPaneName].appendChild(div)
        }

        this.overlayView.onRemove = () => {
            this.overlayView.setMap(null)
        }
    }

    createCustomZone (nextState) {
        google.maps.event.addListener(nextState.drawing, 'overlaycomplete', (event) => {
            this.handleEdit()
            const coordinates = event.overlay.getPath().getArray()
            event.overlay.getPaths().forEach((path) => {
                this.getPoints = () => {
                    return _.map(coordinates, (p) => {
                        const polyLat = p.lat()
                        const polyLng = p.lng()
                        return [polyLat, polyLng]
                    })
                }

                google.maps.event.addListener(path, 'insert_at', () => this.setState({points: this.getPoints()}))

                google.maps.event.addListener(path, 'remove_at', () => this.setState({points: this.getPoints()}))

                google.maps.event.addListener(path, 'set_at', () => this.setState({points: this.getPoints()}))
            })
            this.setState({points: this.getPoints()})
        })
    }

    createCustomZone2 (nextState) {
        google.maps.event.addListener(nextState.drawing, 'overlaycomplete', (event) => {
            this.handleEdit()
            const coordinates = event.overlay.getPath().getArray()
            event.overlay.getPaths().forEach((path) => {
                this.getPoints = () => {
                    return _.map(coordinates, (p) => {
                        const polyLat = p.lat()
                        const polyLng = p.lng()
                        return {lat: polyLat, lng: polyLng}
                    })
                }

                google.maps.event.addListener(path, 'insert_at', () => this.setState({points: this.getPoints()}))

                google.maps.event.addListener(path, 'remove_at', () => this.setState({points: this.getPoints()}))

                google.maps.event.addListener(path, 'set_at', () => this.setState({points: this.getPoints()}))
            })
            this.setState({points: this.getPoints()})
        })
    }

    setEditableFalse () {
        _.map(this.state.zone, (item) => {
            _.get(item, 'zone').setOptions({
                fillColor: '#199ee0',
                fillOpacity: 0.2,
                strokeColor: '#113460',
                editable: false
            })
        })
    }

    editZone (nextProps, nextState) {
        const selectedZone = _.get(_.filter(nextState.zone, (item) => {
            return nextProps.zoneId === item.id
        }), ['0', 'zone'])

        selectedZone.setOptions({
            editable: true,
            fillColor: '#4de03a',
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: '#236406'
        })
        const coordinates = selectedZone.getPath().getArray()
        selectedZone.getPaths().forEach(() => {
            this.getChangedPoints = {
                points: _.map(coordinates, (p) => {
                    const polyLat = p.lat()
                    const polyLng = p.lng()
                    return {lat: polyLat, lng: polyLng}
                })
            }
        })
    }

    getUpdatedZone () {
        if (this.state.zone[ZERO]) {
            const selectedZone = _.get(_.filter(this.state.zone, (item) => {
                return _.toInteger(this.props.zoneId) === item.id
            }), ['0'])

            const coordinates = _.get(selectedZone, 'zone').getPath().getArray()
            _.get(selectedZone, 'zone').getPaths().forEach(() => {
                this.getChangedPoints = {
                    points: _.map(coordinates, (p) => {
                        const polyLat = p.lat()
                        const polyLng = p.lng()
                        return [polyLat, polyLng]
                    })
                }
            })
            this.getChangedPoints.title = _.get(selectedZone, 'title')
            return this.getChangedPoints
        }
        return null
    }

    handleDeleteZone (id) {
        const selectedZone = _.get(_.filter(this.state.zone, (item) => {
            return _.toNumber(id) === item.id
        }), ['0', 'zone'])
        selectedZone.setMap(null)
    }

    componentWillUpdate (nextProps, nextState) {
        if (nextState.drawing) {
            if (_.get(nextProps, 'zoneId')) {
                this.editZone(nextProps, nextState)
            } else {
                this.setEditableFalse()
            }
            this.createCustomZone(nextState)
        }
    }

    componentWillUnmount () {
        this.overlayView.setMap(null)
    }

    render () {
        const {addZone, filter, updateZone, isOpenAddZone, isOpenUpdateZone, deleteZone} = this.props
        const GOOGLE_API_KEY = 'AIzaSyDnUkBg_uV1aa4e7pyEvv3bVxN3RfwNQEo'
        const url = 'http://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY + '&libraries=drawing'

        if (_.get(this.props, ['listData', 'listLoading'])) {
            return (
                <div style={classes.loader}>
                    <CircularProgress size={60} thickness={6}/>
                </div>
            )
        }

        return (
            <div style={{height: '100%', width: '100%'}}>
                <div className='GMap-canvas' id="mappingGoogleCustom" ref='mapping'
                     style={{height: '100%', width: '100%'}}>
                </div>
                <Script
                    url={url}
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />

                {isOpenAddZone && <AddZonePopup
                    filter={filter}
                    handleClearDrawing={this.handleClearDrawing.bind(this)}
                    draw={this.handleDrawing.bind(this)}
                    edit={this.handleEdit.bind(this)}
                    onClose={addZone.handleCloseAddZone}
                    onSubmit={addZone.handleSubmitAddZone}
                    data={() => {
                        return this.state.points
                    }}
                    isDrawing={this.state.isDrawing}
                />}
                {isOpenUpdateZone && <AddZonePopup
                    filter={filter}
                    handleClearDrawing={this.handleClearDrawing.bind(this)}
                    onClose={updateZone.handleCloseUpdateZone}
                    draw={this.handleDrawing.bind(this)}
                    edit={this.handleEdit.bind(this)}
                    onSubmit={updateZone.handleSubmitUpdateZone}
                    initialValues={updateZone.initialValues}
                    data={() => {
                        return this.getUpdatedZone()
                    }}
                    isDrawing={this.state.isDrawing}
                />}
                <ZoneDeleteDialog
                    open={deleteZone.openDeleteZone}
                    onClose={deleteZone.handleCloseDeleteZone}
                    onSubmit={deleteZone.handleSendDeleteZone}
                    deleteZone={this.handleDeleteZone}
                    message="Удалить выбранную зону?"
                    type="submit"

                />
            </div>
        )
    }

}
