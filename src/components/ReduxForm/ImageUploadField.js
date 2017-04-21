import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {FileUpload} from 'redux-file-upload'
import {API_URL} from '../../constants/api'

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
            <FileUpload
                allowedFileTypes={['jpg', 'pdf']}
                data={{type: 'picture'}}
                dropzoneId="fileUpload"
                url={API_URL + '/api/v1/file/file/'}
            >
                <button>
                    Click or drag here
                </button>
            </FileUpload>
        </div>
    )
}

export default enhance(ImageUploadField)
