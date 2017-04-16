import React from 'react'
import {Marker} from 'react-google-maps'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import GoogleMap from '../GoogleMap'
import {DEFAULT_LOCATION} from '../../constants/googleMaps'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            height: '100%'
        },
        error: {
            position: 'absolute',
            zIndex: '99',
            left: 0,
            textAlign: 'center',
            background: '#fff',
            border: '1px solid',
            fontSize: '14px',
            bottom: '2px',
            marginLeft: '40px',
            marginRight: '40px',
            right: '0',
            color: 'red'
        }
    }),
    withState('location', 'setLocation', DEFAULT_LOCATION)
)

const LocationField = ({classes, location, setLocation, input, meta: {error}}) => {
    const handleClick = (pointer) => {
        input.onChange({lat: pointer.latLng.lat(), lng: pointer.latLng.lng()})
        setLocation({lat: pointer.latLng.lat(), lng: pointer.latLng.lng()})
    }

    return (
        <div className={classes.wrapper}>
            {error && <div className={classes.error}>{error}</div>}
            <GoogleMap onClick={handleClick} center={location}>
                <Marker position={location} />
            </GoogleMap>
        </div>
    )
}

export default enhance(LocationField)
