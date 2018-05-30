import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import MUISnackbar from 'material-ui/Snackbar'
import {closeSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
  connect((state) => {
    const open = _.get(state, ['snackbar', 'open'])
    const message = _.get(state, ['snackbar', 'message'])
    const autoHideDuration = _.get(state, ['snackbar', 'autoHideDuration'])

    return {
      open,
      message,
      autoHideDuration
    }
  })
)

const Snackbar = ({dispatch, open, message, autoHideDuration, ...defaultProps}) => {
  return (
    <MUISnackbar
      open={open}
      message={message}
      autoHideDuration={autoHideDuration}
      onRequestClose={() => dispatch(closeSnackbarAction())}
      {...defaultProps}
    />
  )
}

export default enhance(Snackbar)
