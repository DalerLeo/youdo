/* global FormData */
import React from 'react'
import _ from 'lodash'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import * as PATH from '../../../constants/api'
import Dropzone from 'react-dropzone'
import axios from '../../../helpers/axios'
import Loader from '../../Loader'
import ToolTip from '../../Utils/ToolTip'
import ImageImage from 'material-ui/svg-icons/image/image'
import DeleteIcon from 'material-ui/svg-icons/action/highlight-off'
import IconButton from 'material-ui/IconButton'

import t from '../../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      width: '100%',
      '& .imageDropZone': {
        border: '2px #efefef dashed',
        cursor: 'pointer',
        maxHeight: '200px',
        display: 'flex',
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
  withState('fileUploadErrors', 'setFileUploadErrors', null),
  withHandlers({
    handleRemoveImage: props => () => {
      const {input} = props
      return input.onChange(null)
    }
  })
)

const iconStyle = {
  button: {
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    borderRadius: '50%',
    padding: 0
  },
  icon: {
    width: 22,
    height: 22,
    color: '#666'
  }
}
const zero = 0
const ImageUploadField = ({classes, setFileUploadLoading, fileUploadLoading, setFileUploadErrors,
  fileUploadErrors, input, meta: {error}, label, handleRemoveImage, toolTipText}) => {
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
    if (fileUploadLoading) {
      return (<Loader size={0.75}/>)
    }

    if (fileUploadErrors !== null) {
      return (<div className={classes.error}>{t('Ошибка')}: {fileUploadErrors}</div>)
    }

    if (error) {
      return (<div className={classes.error}>{t('Ошибка')}: {error}</div>)
    }

    if (acceptedFiles.length === zero || !_.get(input, 'value')) {
      if (inputFile) {
        return (
          <img src={inputFile}/>
        )
      }
      return (
        <p>
          <ImageImage style={{
            color: '#b9b9b9',
            width: '50px',
            height: '50px',
            display: 'block',
            margin: 'auto'
          }}/>
          {label || t('Добавьте фото')}
        </p>)
    }

    const url = acceptedFiles[zero].preview
    return (<img src={url}/>)
  }
  const hasImage = _.get(input, ['value', 'id']) || _.isNumber(_.get(input, ['value']))
  return (
    <div className={classes.wrapper}>
      <ToolTip text={t(toolTipText)} position="bottom">
        <Dropzone
          onDrop={onDrop}
          className="imageDropZone"
          accept="image/jpeg, image/png, file/txt">
          {dropZoneView}
        </Dropzone>
      </ToolTip>
      {hasImage && <div style={{position: 'absolute', top: '-5px', right: '-5px'}}>
        <IconButton
          style={iconStyle.button}
          onClick={() => handleRemoveImage()}
          iconStyle={iconStyle.icon}>
          <DeleteIcon color="#666666"/>
        </IconButton>
      </div>}
    </div>
  )
}

export default enhance(ImageUploadField)
