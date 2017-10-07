/* eslint no-undef: 0 */
/* eslint no-new: 0 */

/* eslint dot-notation: 0 */

import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import CircularProgress from 'material-ui/CircularProgress'
import AddZonePopup from './AddZonePopup'
import ZoneDeleteDialog from './ZoneDeleteDialog'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import Location from '../Images/market-green.png'
import MarketOff from '../Images/market-red.png'
const MARKER_SIZE = 30
const ZERO = 0
const MINUS_FIVE = -5
const ANCHOR = 8
const SCALED = 18
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
            drawing: null,
            zone: [],
            points: null,
            isDrawing: false,
            initial: true
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

    getMarkers (data) {
        let list = []
        _.map(data, (item) => {
            if (_.get(item, ['location', 'coordinates', '0']) && _.get(item, ['location', 'coordinates', '1'])) {
                list.push(
                    {
                        location: {
                            lat: _.get(item, ['location', 'coordinates', '0']),
                            lng: _.get(item, ['location', 'coordinates', '1'])
                        },
                        name: item.name,
                        id: item.id,
                        isActive: item.isActive
                    }
                )
            }
        })

        const marketOn = {
            url: Location,
            size: new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
            origin: new google.maps.Point(ZERO, ZERO),
            anchor: new google.maps.Point(ANCHOR, ANCHOR),
            scaledSize: new google.maps.Size(SCALED, SCALED)
        }
        const marketOff = {
            url: MarketOff,
            size: new google.maps.Size(MARKER_SIZE, MARKER_SIZE),
            origin: new google.maps.Point(ZERO, ZERO),
            anchor: new google.maps.Point(ANCHOR, ANCHOR),
            scaledSize: new google.maps.Size(SCALED, SCALED)
        }

        const markers = list.map((item) => {
            const marker = new google.maps.Marker({
                position: item.location,
                icon: item.isActive ? marketOn : marketOff,
                animation: google.maps.Animation.DROP,
                map: this.map
            })
            const info = '<div>' + item.name + '</div>'
            const infoWindow = new google.maps.InfoWindow({
                content: info,
                pixelOffset: new google.maps.Size(MINUS_FIVE, ZERO)
            })

            marker.addListener('mouseover', () => {
                infoWindow.open(this.map, marker)
            })
            marker.addListener('mouseout', () => {
                infoWindow.close()
            })

            return marker
        })

        new MarkerClusterer(this.map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
    }

    createMap () {
        const mapOptions = {
            zoom: 13,
            center: GOOGLE_MAP.DEFAULT_LOCATION,
            mapTypeId: 'terrain',
            styles: googleMapStyle,
            mapTypeControl: false,
            panControl: false,
            streetViewControl: false,
            zoomControl: false,
            scaleControl: false,
            fullscreenControl: false
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
            this.createOverlays(meanLat, meanLng, id)
            existingZone.setMap(this.map)
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

    createOverlays (meanLat, meanLng, id) {
        this.overlayView = new google.maps.OverlayView()
        this.overlayView.setMap(this.map)
        this.overlayView.onAdd = () => {
            this.containerElement = document.createElement('div')
            this.containerElement.style.borderStyle = 'none'
            this.containerElement.style.borderWidth = '0px'
            this.containerElement.style.position = 'absolute'
            return this.containerElement
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
            div.style.color = '#000'
            div.style.fontSize = '20px'
            div.style.fontWeight = '700'
            div.innerHTML = 'Z-' + id
            mapPanes[GOOGLE_MAP.FLOATPANE].appendChild(div)
        }

        this.overlayView.onRemove = () => {
            this.containerElement = null
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
            if (nextProps.marketsData.data !== this.props.marketsData.data) {
                this.getMarkers(nextProps.marketsData.data)
            }
        }
    }

    componentWillUnmount () {
        this.overlayView.setMap(null)
        this.state.drawing.setMap(null)
        this.setState({
            zone: null,
            drawing: null,
            points: null,
            isDrawing: null
        })
    }

    render () {
        if (this.map && this.overlayView) {
            this.map.addListener('zoom_changed', () => {
                let mapPane1 = this.overlayView.getPanes()
                mapPane1[GOOGLE_MAP.FLOATPANE].innerHTML = ''
            })
        }
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
