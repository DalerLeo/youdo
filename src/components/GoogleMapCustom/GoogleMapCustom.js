import React from 'react'
import Script from 'react-load-script'


export default class GoogleCustomMap extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            center: null,
            cMap: 'cMap'
        }

    }

    loadMap () {
        const {config} = this.props
        if (this.state.scriptLoaded) {
            this.setState({
                center: {lat: 24.886, lng: -70.268}
            })
        }

        this.map = this.createMap(this.state.center)
        const triangleCoords = [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757},
            {lat: 25.774, lng: -80.190}
        ]
        const bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        })
        bermudaTriangle.setMap(this.map)
    }

    createMap (center) {
        const {config} = this.props

        const mapOptions = {
            zoom: config.initialZoom,
            center,
            mapTypeId: 'terrain'
        }
        console.warn(this.refs.setMap)
        return new google.maps.Map(this.refs.cMap, mapOptions)
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
        console.warn('ScriptLoaded')
        this.loadMap()
    }

    componentDidMount () {
        this.setMap = 'setMap'
        this.setState({
            cMap: 'cMap'
        })
    }
    componentWillUnmount () {
        google.maps.event.clearListeners(this.map, 'zoom_changed')
    }

    render () {
        const GOOGLE_API_KEY = 'AIzaSyDnUkBg_uV1aa4e7pyEvv3bVxN3RfwNQEo'
        const url = 'http://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY

        return (
            <div style={{height: '100%', width: '100%'}}>
                <Script
                    url={url}
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                />
                <div className='GMap-canvas' id="mappingGoogleCustom" ref={this.state.cMap} style={{height: '100%', width: '100%'}}> </div>
            </div>
        )
    }

}
