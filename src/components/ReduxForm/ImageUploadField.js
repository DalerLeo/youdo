import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {API_URL} from '../../constants/api'
import Dropzone from 'react-dropzone'

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
    return (
        <div className={classes.wrapper}>
            <Dropzone onDrop={}>
                {({isDragActive, isDragReject, acceptedFiles, rejectedFiles}) => {
                    if (isDragActive) {
                        return 'This file is authorized'
                    }
                    if (isDragReject) {
                        return 'This file is not authorized'
                    }
                    return acceptedFiles.length || rejectedFiles.length
                        ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
                        : 'Try dropping some files'
                }}
            </Dropzone>
        </div>
    )
}

export default enhance(ImageUploadField)
