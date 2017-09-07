import React from 'react'
import Script from 'react-load-script'
import _ from 'lodash'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import CircularProgress from 'material-ui/CircularProgress'
import AddZonePopup from './AddZonePopup'

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
            toggle: false
        }

        this.handleClearDrawing = this.handleClearDrawing.bind(this)
    }

    loadMap () {
        if (this.state.scriptLoaded) {
            this.setState({
                center: {lat: 24.886, lng: -70.268}
            })
        }

        this.map = this.createMap(this.state.center)
        let locations = [
            {lat: -31.563910, lng: 147.154312},
            {lat: -33.718234, lng: 150.363181},
            {lat: -43.999792, lng: 170.463352}
        ]
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

        _.map(_.get(this.props, ['listData', 'data']), (item) => {
            const id = _.get(item, 'id')
            const title = _.get(item, 'title')
            const point = _.map(_.get(item, ['coordinates', 'coordinates', '0']), (p) => {
                const lat = _.get(p, '0')
                const lng = _.get(p, '1')

                return {lat: lat, lng: lng}
            })

            const customZone = new google.maps.Polygon({
                paths: point,
                fillColor: '#199ee0',
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: '#113460',
                clickable: true,
                draggable: false,
                zIndex: 1
            })
            customZone.setMap(this.map)
        })
        let markers = locations.map((location, i) => {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length],
                map: this.map
            })
        })
        new google.maps.Marker({
            position: GOOGLE_MAP.DEFAULT_LOCATION,
            map: this.map
        })

        new MarkerClusterer(this.map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
        this.setState({
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
                    editable: true,
                    zIndex: 1
                }
            })
        })
    }

    createMap () {
        const mapOptions = {
            zoom: 4,
            center: GOOGLE_MAP.DEFAULT_LOCATION,
            mapTypeId: 'terrain'
        }
        return new google.maps.Map(this.refs.mapping, mapOptions)
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

        this.loadMap()
    }

    handleClearDrawing (...evt) {
        google.maps.event.clearInstanceListeners(this.state.drawing)
        this.state.drawing.setMap(null)
    }

    handleDrawing () {
        if (this.state.drawing) {
            this.state.drawing.setMap(this.map)
        }
    }

    handleEdit () {
        if (this.state.drawing) {
            this.state.drawing.setMap(null)
        }
    }

    componentWillUpdate () {
        if (this.state.drawing) {
            google.maps.event.addListener(this.state.drawing, 'overlaycomplete', (event) => {
                const coordinates = event.overlay.getPath().getArray()
                const points = event.overlay.getPaths().forEach((path) => {
                    this.getPoints = () => {
                        return _.map(coordinates, (p) => {
                            const polyLat = p.lat()
                            const polyLng = p.lng()
                            return {lat: polyLat, lng: polyLng}
                        })
                    }
                    google.maps.event.addListener(path, 'insert_at', () => {
                        console.warn('insert')
                        return this.getPoints()
                    })

                    google.maps.event.addListener(path, 'remove_at', () => {
                        console.warn('remove')
                        return this.getPoints()
                    })

                    google.maps.event.addListener(path, 'set_at', () => {
                        console.warn('set')
                        return this.getPoints()
                    })
                })
            })
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (_.get(nextState, 'scriptLoaded')) {
            this.loadMap()
        }
        return true
    }

    render () {
        const {addZone, filter, updateZone, isOpenAddZone, isOpenUpdateZone} = this.props
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
                />}
                {isOpenUpdateZone && <AddZonePopup
                    filter={filter}
                    handleClearDrawing={this.handleClearDrawing.bind(this)}
                    onClose={updateZone.handleCloseUpdateZone}
                    draw={this.handleDrawing.bind(this)}
                    edit={this.handleEdit.bind(this)}
                    onSubmit={updateZone.handleSubmitUpdateZone}
                    initialValues={updateZone.initialValues}
                />}
            </div>
        )
    }

}
