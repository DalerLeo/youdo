/* global FormData */
import React from 'react'
import _ from 'lodash'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import * as PATH from '../../../constants/api'
import Dropzone from 'react-dropzone'
import axios from '../../../helpers/axios'
import t from '../../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      lineHeight: '20px',
      // .width: '100%',
      display: 'flex',
      alignItems: 'center',
      '& .imageDropZone': {
        cursor: 'pointer',
        maxHeight: '130px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        '& > div': {
          display: 'flex',
          alignItems: 'center'
        }
      },
      '& .fileDelete': {
        position: 'absolute',
        top: '-5px',
        right: '-8px'}
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
    handleRemoveFile: props => () => {
      const {input} = props
      return input.onChange('')
    }
  })
)

const labelStyle = {
  color: '#12aaeb',
  fontWeight: '600',
  whiteSpace: 'noWrap'
}

const FileUploadField = ({
  classes, setFileUploadLoading, fileUploadLoading, setFileUploadErrors, withfileDetails,
  fileUploadErrors, input, meta: {error}, label, toolTipText, handleRemoveFile, fileName
}) => {
  const inputFile = _.get(input, ['value', 'file'])
  const inputName = _.last(_.split(_.get(input, ['name']), '.'))
  const onDrop = (files) => {
    const formData = new FormData()
    const firstElement = 0
    setFileUploadLoading(true)
    formData.append('file', files[firstElement])
    return axios().post(PATH.FILE_UPLOAD, formData)
      .then((response) => {
        setFileUploadLoading(false)
        setFileUploadErrors(null)
        if (withfileDetails) {
          input.onChange({id: response.data.id, name: response.data.name, file: response.data.file})
        } else {
          input.onChange(response.data.id)
        }
      }).catch((newError) => {
        const errorData = _.get(newError, ['response', 'data'])
        setFileUploadLoading(false)
        setFileUploadErrors(_.get(errorData, 'file.0') || _.get(errorData, firstElement))
        input.onChange(null)
      })
  }

  const dropZoneView = ({acceptedFiles, rejectedFiles}) => {
    const zero = 0
    if (fileUploadLoading) {
      return (<div>{label} Загрузка...</div>)
    }

    if (fileUploadErrors !== null) {
      return (<div>{label}<div className={classes.error}>{t('Ошибка')}</div></div>)
    }

    if (error) {
      return (<div>{label}<div className={classes.error}>{t('Ошибка')}</div></div>)
    }

    if (acceptedFiles.length === zero || !_.get(input, 'value')) {
      const inputFormat = _
        .chain(inputFile)
        .split('.')
        .last()
        .value()
      if (inputFile) {
        return (
          <div style={labelStyle}>
            {label} {inputName}.{inputFormat}
          </div>
        )
      }
      return (
        <div style={labelStyle}>
          {label}
        </div>)
    }
    const docFormat = _
      .chain(acceptedFiles)
      .get([zero, 'name'])
      .split('.')
      .last()
      .value()
    return (
      <div style={labelStyle}>
        {label}.{docFormat}
      </div>)
  }

  // .  const hasFile = _.get(input, ['value', 'id']) || _.isNumber(_.get(input, ['value']))

  return (
    <div className={classes.wrapper}>
      <Dropzone
        onDrop={onDrop}
        className="imageDropZone">
        {dropZoneView}
      </Dropzone>
    </div>
  )
}

export default enhance(FileUploadField)
