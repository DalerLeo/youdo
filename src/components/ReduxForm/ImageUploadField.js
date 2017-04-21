import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'

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
)

const ImageUploadField = ({classes, location, setLocation, input, meta: {error}}) => {
    const handleImageChange = (pointer) => {
        input.onChange({lat: pointer.latLng.lat(), lng: pointer.latLng.lng()})
        setLocation({lat: pointer.latLng.lat(), lng: pointer.latLng.lng()})
    }
    const imagePreview = ''
    return (
        <div className={classes.wrapper}>
            <input type="file" onChange={handleImageChange} />
            {imagePreview}
        </div>
    )
}

export default enhance(ImageUploadField)
