/* eslint no-invalid-this: 0 */
import React, {Component} from 'react'
import fp from 'lodash/fp'
import axios from 'helpers/axios'
import * as API from 'constants/api'
import Fileicon from 'material-ui/svg-icons/image/image'
import LoadingIcon from 'material-ui/svg-icons/notification/sync'
const inputStyle = {
  width: '0.1px',
  height: '0.1px',
  opacity: '0',
  overflow: 'hidden',
  position: 'absolute',
  zIndex: '-1'
}
const iconStyle = {
  height: '21px',
  cursor: 'pointer'
}
const loadingStyle = {
  animation: 'spin-off 2s infinite ease-out',
  height: '21px'

}
const FILE_SIZE = 150000
export default class ImageAdd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      error: '',
      loading: false
    }
    this.setImage = this.setImage.bind(this)
  }

  setImage = (ev) => {
    const {editorState, onChange, modifier} = this.props

    const file = fp.get('target.files.0', ev)
    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    if (types.every(type => file && file.type !== type)) {
      this.setState({error: 'is not a supported format'})
    }

    if (file.size > FILE_SIZE) {
      this.setState({error: 'Too large'})
    }
    formData.append('file', file)
    this.setState({loading: true})
    return axios().post(API.FILE_UPLOAD, formData)
      .then((response) => {
        this.setState({loading: false, error: null, url: response.data.file})
        onChange(modifier(editorState, response.data.file))
        return response
        //    Input.onChange(response.data.id)
        //   SetObj(getImage(classes, response.data.file))
      }).catch((newError) => {
        const errorData = fp.get(['response', 'data'], newError)
        this.setState({loading: false, error: errorData})
        // SetFileUploadErrors(errorData)
        // SetFileUploadLoading(false)
        // Input.onChange(null)
      })
  }
  render () {
    return (
      <div>
        <div>
          <input
            style={inputStyle}
            onChange={this.setImage}
            id={'fileInput'}
            type="file"
          />
          <label htmlFor="fileInput">
            {this.state.loadng
              ? <LoadingIcon style={loadingStyle}/>
              : <Fileicon style={iconStyle}/>
            }
          </label>
        </div>
      </div>
    )
  }
}
