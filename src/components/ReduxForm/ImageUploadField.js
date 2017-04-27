/* global FormData */
import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import * as PATH from '../../constants/api'
import Dropzone from 'react-dropzone'
import axios from '../../helpers/axios'
import CircularProgress from 'material-ui/CircularProgress'

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
    withState('fileUploadLoading', 'setFileUploadLoading', false),
    withState('fileUploadErrors', 'setFileUploadErrors', null),
    withState('uploadedImage', 'setUploadedImage', null)
)

const ImageUploadField = ({classes, setFileUploadLoading, fileUploadLoading, setFileUploadErrors,
    fileUploadErrors, setUploadedImage, uploadedImage}) => {
    const onDrop = (files) => {
        const formData = new FormData()
        const firstElement = 0
        setFileUploadLoading(true)
        formData.append('file', files[firstElement])
        return axios().post(PATH.FILE_UPLOAD, formData)
            .then((response) => {
                setFileUploadLoading(false)
                setFileUploadErrors(null)
                setUploadedImage(response.data)
            }).catch((error) => {
                const errorData = _.get(error, ['response', 'data'])
                setFileUploadErrors(errorData.file[firstElement])
                setFileUploadLoading(false)
                setUploadedImage(null)
            })
    }

    const dropZoneView = ({acceptedFiles, rejectedFiles}) => {
        const zero = 0
        if (fileUploadLoading) {
            return (<CircularProgress size={80} thickness={5}/>)
        }

        if (fileUploadErrors !== null) {
            return (<div><b>Error:</b> <i>{fileUploadErrors}</i></div>)
        }

        if (acceptedFiles.length === zero) {
            return 'Try dropping some files'
        }
        const url = acceptedFiles[zero].preview
        return (<img src={url}/>)
    }

    return (
        <div className={classes.wrapper}>
            <Dropzone
                onDrop={onDrop}
                accept="image/jpeg, image/png">
                {dropZoneView}
            </Dropzone>
        </div>
    )
}

export default enhance(ImageUploadField)
