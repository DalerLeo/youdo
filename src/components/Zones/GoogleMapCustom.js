/* eslint no-undef: 0 */
/* eslint no-new: 0 */
/* eslint dot-notation: 0 */

import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import Loader from '../Loader'
import AddZonePopup from './AddZonePopup'
import ZoneDeleteDialog from './ZoneDeleteDialog'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import Location from '../Images/market-green.png'
import MarketOff from '../Images/market-red.png'
import Checkbox from 'material-ui/Checkbox'
const MARKER_SIZE = 30
const ZERO = 0
const INFO_WINDOW_OFFSET = -7
const ANCHOR = 7
const SCALED = 14
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

const styles = {
    block: {
        maxWidth: 250
    },
    checkbox: {

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
            initial: true,
            currentOverlay: null,
            showMarkets: false
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
        if (this.state.drawing) {
            this.state.drawing.map && this.state.drawing.setMap(null)
        }
        if (this.state.currentOverlay) {
            // Clear newly drawn overlay from map
            this.state.currentOverlay.map && this.state.currentOverlay.setMap(null)
        }
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
        if (this.state.drawing && this.state.drawing.map) {
            this.state.drawing.setMap(null)
            this.setState({
                isDrawing: false
            })
        }
    }

    getMarkers (data) {
        let list = []
        _.map(data, (item) => {
            if (_.get(item, ['location', 'lat']) && _.get(item, ['location', 'lon'])) {
                list.push(
                    {
                        location: {
                            lat: _.get(item, ['location', 'lat']),
                            lng: _.get(item, ['location', 'lon'])
                        },
                        name: item.name,
                        id: item.id,
                        isActive: item.isActive,
                        address: item.address
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

        this.markers = list.map((item) => {
            const marker = new google.maps.Marker({
                position: item.location,
                icon: item.isActive ? marketOn : marketOff,
                animation: google.maps.Animation.DROP,
                map: this.map
            })
            const info = '<div><p><b>Название:</b> ' + item.name + '</p><p><b>Адрес:</b> ' + item.address + '</p></div>'
            const infoWindow = new google.maps.InfoWindow({
                content: info,
                pixelOffset: new google.maps.Size(INFO_WINDOW_OFFSET, ZERO)
            })
            marker.addListener('click', () => {
                this.props.handleOpenShopDetails(item.id)
            })
            marker.addListener('mouseover', () => {
                infoWindow.open(this.map, marker)
            })
            marker.addListener('mouseout', () => {
                infoWindow.close()
            })

            return marker
        })

        this.cluster = new MarkerClusterer(this.map, this.markers,
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
            this.createOverlays(meanLat, meanLng, title)
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

    createOverlays (meanLat, meanLng, title) {
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
            div.style.color = '#333'
            div.style.fontSize = '20px'
            div.style.fontWeight = '700'
            div.style.whiteSpace = 'nowrap'
            div.innerHTML = title
            mapPanes[GOOGLE_MAP.FLOATPANE].appendChild(div)
        }

        this.overlayView.onRemove = () => {
            this.containerElement = null
        }
    }

    createCustomZone (nextState) {
        google.maps.event.addListener(nextState.drawing, 'overlaycomplete', (event) => {
            // Disable drawing manager from map
            this.handleEdit()
            // Getting currentOverlay for clearing it if not needed
            this.setState({
                currentOverlay: event.overlay
            })
            // Make zone editable after overlay is drawn
            event.overlay.setOptions({
                editable: true,
                fillColor: '#4de03a',
                fillOpacity: 0.3,
                strokeWeight: 2,
                strokeColor: '#236406'
            })
            // Get points when its edited
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

    editZone (nextProps, nextState) {
        // Find not selected zones
        const otherZones = _.filter(nextState.zone, (item) => {
            return nextProps.zoneId !== item.id
        })
        // Disable editable of not selected zones
        _.map(otherZones, (item) => {
            _.get(item, 'zone').setOptions({
                fillColor: '#199ee0',
                fillOpacity: 0.2,
                strokeColor: '#113460',
                editable: false
            })
        })

        // Find selected zone with ID, then make it editable
        if (nextProps.zoneId) {
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
                // Save changed coordinates in this for future calls
                this.getChangedPoints = {
                    points: _.map(coordinates, (p) => {
                        const polyLat = p.lat()
                        const polyLng = p.lng()
                        return {lat: polyLat, lng: polyLng}
                    })
                }
            })
        }
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
            // Save title of updating zone to this for passing in handleUpdate
            this.getChangedPoints.title = _.get(selectedZone, 'title')
            return this.getChangedPoints
        }
        return null
    }

    handleDeleteZone (id) {
        const selectedZone = _.get(_.filter(this.state.zone, (item) => {
            return _.toNumber(id) === item.id
        }), ['0', 'zone'])
        // Removes zone from map
        selectedZone.setMap(null)
    }

    componentWillUpdate (nextProps, nextState) {
        if (nextState.drawing) {
            if (!_.isEmpty(nextState.zone) &&
                _.get(this, ['props', 'zoneId']) !== _.get(nextProps, 'zoneId')) {
                this.editZone(nextProps, nextState)
            }
            _.get(nextProps, ['addZone', 'openAddZone']) && this.createCustomZone(nextState)

            const {marketsData} = this.props
            if (nextState.showMarkets && this.state.showMarkets !== nextState.showMarkets && !_.isEmpty(_.get(marketsData, 'data'))) {
                this.getMarkers(nextProps.marketsData.data)
            }

            if (_.get(nextState, 'currentOverlay') &&
                !_.get(nextProps, ['addZone', 'openAddZone']) &&
                _.get(nextProps, ['addZone', 'openAddZone']) !== _.get(this, ['props', 'addZone', 'openAddZone'])) {
                this.handleClearDrawing()
            }
        }
        // For deleting markers if checkbox unchecked
        if (!nextState.showMarkets && this.cluster) {
            this.cluster.clearMarkers()
            this.markers = null
            this.cluster = null
        }
    }

    componentWillUnmount () {
        if (this.overlayView) {
            this.overlayView.setMap(null)
            this.overlayView.onAdd = null
            this.overlayView.draw = null
            this.overlayView.onRemove = null
        }
        this.state.drawing.setMap(null)
        this.setState({
            zone: null,
            drawing: null,
            points: null,
            isDrawing: null,
            currentOverlay: null
        })
        this.overlayView = null
        this.cluster = null
        this.map = null
    }
    updateCheck () {
        this.setState((oldState) => {
            return {
                showMarkets: !oldState.showMarkets
            }
        })
    }

    render () {
        if (this.map && this.overlayView) {
            this.map.addListener('zoom_changed', () => {
                let mapFloatPane = this.overlayView.getPanes()
                mapFloatPane[GOOGLE_MAP.FLOATPANE].innerHTML = ''
            })
        }

        const {addZone, filter, updateZone, isOpenAddZone, isOpenUpdateZone, deleteZone, isOpenToggle} = this.props

        const marker = {
            background: '#fff',
            position: 'absolute',
            bottom: '2px',
            right: isOpenToggle ? '450px' : '0',
            zIndex: '1',
            padding: '8px 15px',
            transition: 'all 0.3s ease',
            boxShadow: 'rgba(0, 0, 0, 0.12) -2px -2px 6px, rgba(0, 0, 0, 0.12) -2px -2px 4px'
        }

        const GOOGLE_API_KEY = process.env.GOOGLE_KEY ? process.env.GOOGLE_KEY : 'AIzaSyDnUkBg_uV1aa4e7pyEvv3bVxN3RfwNQEo'
        const url = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY + '&libraries=drawing'

        if (_.get(this.props, ['listData', 'listLoading'])) {
            return (
                <div style={classes.loader}>
                    <Loader size={0.75}/>
                </div>
            )
        }

        return (
            <div style={{height: '100%', width: '100%', overflow: 'hidden'}}>
                <div style={marker}>
                    <Checkbox
                        label="Магазины"
                        checked={this.state.showMarkets}
                        onCheck={this.updateCheck.bind(this)}
                        style={styles}
                        iconStyle={{marginRight: '5px'}}
                    />
                </div>
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
                    update={true}
                    filter={filter}
                    handleClearDrawing={this.handleClearDrawing.bind(this)}
                    onClose={updateZone.handleCloseUpdateZone}
                    draw={this.handleDrawing.bind(this)}
                    edit={this.handleEdit.bind(this)}
                    onSubmit={updateZone.handleSubmitUpdateZone}
                    initialValues={ {zoneName: _.get(this.getUpdatedZone(), 'title')} }
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
