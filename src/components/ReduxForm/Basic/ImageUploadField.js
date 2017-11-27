/* global FormData */
import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import * as PATH from '../../../constants/api'
import Dropzone from 'react-dropzone'
import axios from '../../../helpers/axios'
import Loader from '../../Loader'
import ImageImage from 'material-ui/svg-icons/image/image'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            '& .imageDropZone': {
                border: '2px #ccc dashed',
                cursor: 'pointer',
                width: '200px',
                height: '200px',
                display: 'flex',
                margin: '20px 0 0 auto',
                justifyContent: 'space-around',
                alignItems: 'center',
                overflow: 'hidden',
                '& img': {
                    width: '100%',
                    display: 'block'
                },
                '& p': {
                    textAlign: 'center'
                }
            }
        },
        error: {
            textAlign: 'center',
            fontWeight: '600',
            color: '#f44336'
        }
    }),
    withState('fileUploadLoading', 'setFileUploadLoading', false),
    withState('fileUploadErrors', 'setFileUploadErrors', null)
)

const ImageUploadField = ({classes, setFileUploadLoading, fileUploadLoading, setFileUploadErrors,
    fileUploadErrors, input, meta: {error}}) => {
    const inputFile = _.get(input, ['value', 'file'])
    const onDrop = (files) => {
        const formData = new FormData()
        const firstElement = 0
        setFileUploadLoading(true)
        formData.append('file', files[firstElement])
        return axios().post(PATH.FILE_UPLOAD, formData)
            .then((response) => {
                setFileUploadLoading(false)
                setFileUploadErrors(null)
                input.onChange(response.data.id)
            }).catch((newError) => {
                const errorData = _.get(newError, ['response', 'data'])
                setFileUploadErrors(errorData.file[firstElement])
                setFileUploadLoading(false)
                input.onChange(null)
            })
    }

    const dropZoneView = ({acceptedFiles, rejectedFiles}) => {
        const zero = 0
        if (fileUploadLoading) {
            return (<Loader size={0.75}/>)
        }

        if (fileUploadErrors !== null) {
            return (<div className={classes.error}>Ошибка: {fileUploadErrors}</div>)
        }

        if (error) {
            return (<div className={classes.error}>Ошибка: {error}</div>)
        }

        if (acceptedFiles.length === zero) {
            if (inputFile) {
                return (
                    <img src={inputFile} />
                )
            }
            return (
                <p>
                    <ImageImage style={{color: '#b9b9b9', width: '50px', height: '50px', display: 'block', margin: 'auto'}}/>
                    Добавьте фото
                </p>)
        }
        const url = acceptedFiles[zero].preview
        return (<img src={url}/>)
    }

    return (
        <div className={classes.wrapper}>
            <Dropzone
                onDrop={onDrop}
                className="imageDropZone"
                accept="image/jpeg, image/png">
                {dropZoneView}
            </Dropzone>
        </div>
    )
}

export default enhance(ImageUploadField)
