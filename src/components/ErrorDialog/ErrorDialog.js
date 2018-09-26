import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Error from 'material-ui/svg-icons/alert/error-outline'
import {closeErrorAction} from '../../actions/error'

const enhance = compose(
  injectSheet({
    popUp: {
      overflowY: 'hidden !important',
      fontSize: '13px !important',
      position: 'relative',
      padding: '0 !important',
      overflowX: 'hidden',
      height: '100%'
    },
    inContent: {
      background: '#ff6663',
      padding: '40px 0',
      width: '100%',
      color: '#fff',
      textAlign: 'center',
      '& svg': {
        margin: 'auto'
      },
      '& > div': {
        margin: '25px 0 20px',
        fontWeight: '600'
      },
      '& > button': {
        '& > div': {
          lineHeight: 'normal !important'
        }
      }
    },
    bodyContent: {
      position: 'relative',
      '& > button': {
        top: '3px',
        right: '3px',
        padding: '0 !important',
        position: 'absolute !important'
      }
    },
    message: {
      maxHeight: '600px',
      overflowY: 'auto'
    }
  }),
  connect((state) => {
    const open = _.get(state, ['error', 'open'])
    const message = _.get(state, ['error', 'message'])
    const arrMessage = _.get(state, ['error', 'arrMessage'])

    return {
      open,
      message,
      arrMessage
    }
  })
)

let errors = ''
const showErrors = (error, label) => {
  if (_.isObject(error) || _.isArray(error)) {
    _.map(error, (value, key) => {
      showErrors(value, (_.isNumber(key)) ? label : key)
    })
  } else {
    errors += label ? label + ': ' : ''
    errors += error + '<br/>'
  }
  return errors
}

const ErrorDialog = ({dispatch, message, open, classes, ...defaultProps}) => {
  const close = () => dispatch(closeErrorAction())
  const bug = open ? showErrors(message) : null
  errors = ''
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={close}
      contentStyle={{width: '350px'}}
      className={classes.dialog}
      bodyClassName={classes.popUp}
      overlayStyle={{background: 'rgba(0,0,0,0.45)'}}
      style={{zIndex: '9999999999'}}
      {...defaultProps}>
      <div className={classes.bodyContent}>
        <IconButton onClick={close}>
          <CloseIcon color="#fff"/>
        </IconButton>
        <div className={classes.inContent}>
          <Error color="#fff" style={{width: '55px', height: '55px'}}/>
          <div dangerouslySetInnerHTML={{__html: bug}}>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default enhance(ErrorDialog)
