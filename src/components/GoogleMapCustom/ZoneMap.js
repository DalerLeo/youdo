import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {withGoogleMap, GoogleMap as DefaultGoogleMap, Polygon, OverlayView} from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import CircularProgress from 'material-ui/CircularProgress'
import * as GOOGLE_MAP from '../../constants/googleMaps'
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager'
import {googleMapStyle} from '../../constants/googleMapsStyle'
import toBoolean from '../../helpers/toBoolean'

const enhance = compose(
    withScriptjs,
    withGoogleMap
)
const GoogleMapWrapper = enhance(({onMapLoad, isOpenAddZone, listData, zoneId, filter, input, ...props}) => {
    const isOpenDraw = toBoolean(_.get(filter.getParams(), 'draw'))
    const isOpenUpdate = toBoolean(_.get(filter.getParams(), 'openUpdateZone'))

    const handleOverlayComplete = (event) => {
        const coordinates = event.overlay.getPath().getArray()
        event.overlay.getPaths().forEach((path) => {
            const change = () => {
                return input.onChange(_.map(coordinates, (p) => {
                    const polyLat = p.lat()
                    const polyLng = p.lng()
                    return [polyLat, polyLng]
                }))
            }
            google.maps.event.addListener(path, 'insert_at', () => {
                change()
            })

            google.maps.event.addListener(path, 'remove_at', () => {
                return false
            })

            google.maps.event.addListener(path, 'set_at', () => {
                change()
            })
        })
        return input.onChange(_.map(coordinates, (p) => {
            const polyLat = p.lat()
            const polyLng = p.lng()
            return [polyLat, polyLng]
        }))
    }

    const polygonOptions = {
        fillColor: '#199ee0',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#113460'
    }
    const editPolygonOptioons = {
        editable: true,
        fillColor: '#4de03a',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#236406'
    }

    return (
        <DefaultGoogleMap ref={onMapLoad} {...props} >
            {(isOpenDraw && isOpenAddZone) &&
            <DrawingManager
                deftest="a"
                defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
                onOverlayComplete={handleOverlayComplete}
                defaultOptions={{
                    drawingControl: false,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
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
                }}
            />}
            {_.map(_.get(listData, 'data'), (item) => {
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
                if (_.isEmpty(point)) {
                    return false
                }

                const getPixelPositionOffset = (width, height) => {
                    const TWO = 2
                    return {
                        x: -(width / TWO),
                        y: -(height / TWO)
                    }
                }

                if (id === zoneId && isOpenUpdate) {
                    return (
                        <Polygon
                            key={id}
                            paths={point}
                            options={editPolygonOptioons}
                        />
                    )
                }

                return (
                    <div key={id}>
                        <Polygon
                            paths={point}
                            options={polygonOptions}
                        />
                        <OverlayView
                            position={{lat: meanLat, lng: meanLng}}
                            getPixelPositionOffset={getPixelPositionOffset}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                            <div style={{textAlign: 'center'}}>
                                <div style={{fontSize: '22px'}}>Z-{id}</div>
                                <div>{title}</div>
                            </div>
                        </OverlayView>
                    </div>
                )
            })}
            {props.children}
        </DefaultGoogleMap>
    )
})

const Loader = () =>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <CircularProgress size={40} thickness={4} />
    </div>

const GoogleMap = (props) => {
    const {...defaultProps} = props
    const isOpenAddZone = _.get(props, 'isOpenAddZone')
    const filter = _.get(props, 'filter')
    const zoneId = _.get(props, 'zoneId')
    const listData = _.get(props, 'listData')

    return (
        <GoogleMapWrapper
            defaultCenter={GOOGLE_MAP.DEFAULT_LOCATION}
            googleMapURL={GOOGLE_MAP.GOOGLE_API_URL}
            loadingElement={<Loader />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}
            defaultZoom={13}
            radius="500"
            defaultOptions={{styles: googleMapStyle}}

            listData={listData}
            zoneId={zoneId}
            isOpenAddZone={isOpenAddZone}
            filter={filter}
            {...defaultProps}>
            {props.children}
        </GoogleMapWrapper>
    )
}

export default GoogleMap