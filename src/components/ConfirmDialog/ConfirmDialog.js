import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import classNames from 'classnames'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../helpers/translate'

const enhance = compose(
  injectSheet({
    popUp: {
      overflowY: 'unset !important',
      fontSize: '13px !important',
      position: 'relative',
      padding: '0 !important',
      overflowX: 'unset',
      height: '100%',
      marginBottom: '64px'
    },
    titleContent: {
      background: '#fff',
      color: '#333',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #efefef',
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999'
    },
    inContent: {
      minHeight: '50px',
      overflow: 'unset',
      padding: '0 30px',
      color: '#333',
      position: 'relative'
    },
    bodyContent: {
      width: '100%'
    },
    form: {
      position: 'relative'
    },
    field: {
      width: '100%'
    },
    inputFieldCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      marginTop: '7px',
      '& > div:first-child': {
        fontSize: '13px !important'
      },
      '& label': {
        top: '20px !important',
        lineHeight: '5px !important'
      },
      '& input': {
        marginTop: '0 !important'
      }
    },
    bottomButton: {
      bottom: '0',
      left: '0',
      right: '0',
      padding: '10px',
      zIndex: '999',
      borderTop: '1px solid #efefef',
      background: '#fff',
      textAlign: 'right',
      '& span': {
        fontSize: '13px !important',
        fontWeight: '600 !important',
        verticalAlign: 'inherit !important'
      }
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
    },
    background: {
      background: '#f1f5f8',
      boxSizing: 'content-box',
      fontWeight: '600',
      padding: '20px 30px',
      margin: '0 -30px',
      width: '100%'
    },
    warningBackground: {
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      position: 'absolute',
      background: '#fef5f5',
      color: '#f44336',
      padding: '20px 30px',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    },
    confirm: {
      padding: '20px 0'
    },
    loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: '#fff',
      top: '0',
      left: '0',
      alignItems: 'center',
      zIndex: '999',
      textAlign: 'center',
      justifyContent: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    }
  })
)

const ConfirmDialog = enhance((props) => {
  const {open, onClose, className, classes, customName, type, message, onSubmit, loading, warning} = props
  const typesList = {
    delete: {
      name: t('Подтверждение удаления'), submitName: t('Удалить')
    },
    cancel: {
      name: t('Подтверждение отмены'), submitName: t('Подтвердить')
    },
    submit: {
      name: t('Подтверждение запроса'), submitName: t('Подтвердить')
    },
    create: {
      name: 'Создания ' + customName, submitName: t('Подтвердить')
    }
  }
  const title = _.get(typesList, [type, 'name'])
  const buttonLabel = _.get(typesList, [type, 'submitName'])

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      contentStyle={{width: '500px'}}
      className={classes.dialog}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{title}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <div className={classes.inContent}>
          {loading && (
            <div className={classes.loader}>
              <Loader size={0.75}/>
            </div>
          )}
          {message && (
            <div className={classNames({
              [className]: true,
              [classes.background]: !warning,
              [classes.warningBackground]: warning
            })}>
              {message}
            </div>
          )}
        </div>
        <div className={classes.bottomButton}>
          <FlatButton
            className={classes.actionButton}
            label={buttonLabel}
            labelStyle={warning ? {color: '#f44336'} : {color: '#129fdd'}}
            primary={true}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Dialog>
  )
})

ConfirmDialog.propTypes = {
  type: PropTypes.oneOf(['delete', 'cancel', 'submit', 'create']).isRequired,
  message: PropTypes.any,
  loading: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default ConfirmDialog
