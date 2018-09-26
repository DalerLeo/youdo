import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {Field, reduxForm} from 'redux-form'
import {TextField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import {BORDER_STYLE} from '../../../constants/styleConstants'

const enhance = compose(
  injectSheet({
    dialog: {
      overflowY: 'auto'
    },
    popUp: {
      color: '#333 !important',
      overflowY: 'unset !important',
      overflowX: 'unset !important',
      fontSize: '13px !important',
      position: 'relative',
      padding: '0 !important',
      height: '100%',
      maxHeight: 'none !important',
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
      borderBottom: BORDER_STYLE,
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999'
    },
    inContent: {
      padding: '20px 30px',
      color: '#333'
    },
    form: {
      position: 'relative'
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
        color: '#129fdd',
        verticalAlign: 'inherit !important'
      }
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
    textFieldArea: {
      top: '-5px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important'
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
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
      display: ({loading}) => loading ? 'flex' : 'none'
    }
  }),
  reduxForm({
    form: 'ApplicationSendReportForm',
    enableReinitialize: true
  }),
  withState('currentFocused', 'updateFocus', null)
)

const ApplicationSendReportDialog = enhance((props) => {
  const {
    open,
    loading,
    handleSubmit,
    onClose,
    classes
  } = props
  const onSubmit = handleSubmit(() => props.onSubmit())
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={loading ? {width: '400px'} : {width: '400px'}}
      bodyStyle={{minHeight: 'auto'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{t('Отправить отчет клиенту')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent}>
            <Field
              name={'email'}
              label={'Email'}
              className={classes.inputFieldCustom}
              component={TextField}
              fullWidth/>
            <Field
              name={'message'}
              label={'Сообщение'}
              className={classes.textFieldArea}
              component={TextField}
              multiLine
              rows={1}
              fullWidth/>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Отправить')}
              labelStyle={{fontSize: '13px'}}
              className={classes.actionButton}
              primary={true}
              type="submit"
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
})

ApplicationSendReportDialog.propTyeps = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default ApplicationSendReportDialog
