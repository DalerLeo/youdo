import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
// .import Loader from '../../Loader/index'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../helpers/translate'

export const APPLICANT_MAIL_DIALOG_OPEN = 'openMailDialog'
const enhance = compose(
  injectSheet({
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
      borderBottom: '1px solid #efefef',
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999'
    },
    inputFieldCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      marginTop: '7px',
      '& div': {
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
    bodyContent: {
      width: '100%'
    },
    form: {
      position: 'relative'
    },
    field: {
      margin: '0',
      width: '100%',
      '& .col-xs-6': {
        '&:first-child': {
          paddingLeft: '0'
        },
        '&:nth-child(2)': {
          paddingRight: '0'
        }
      }
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
      justifyContent: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    },
    dialogAddUser: {
      overflowY: 'auto !important'
    },
    inContent: {
      padding: '10px 30px',
      display: 'flex',
      justifyContent: 'space-between'
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
        fontWeight: '600 !important',
        verticalAlign: 'inherit !important'
      }
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
    },
    lastBlock: {
      alignItems: 'center',
      justifyContent: 'space-between',
      display: 'flex'
    },
    success: {
      padding: '15px 30px',
      backgroundColor: '#efefef',
      fontWeight: '600',
      marginTop: '15px'
    }
  })
)

const ApplicantMailDialog = enhance((props) => {
  const {
    open,
    loading,
    // . onSubmit,
    onClose,
    classes,
    data
  } = props

  const firstName = _.get(data, 'firstName')
  const lastName = _.get(data, 'lastName')
  const fatherName = _.get(data, 'fatherName')
  const email = _.get(data, 'email')
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialogAddUser}
      contentStyle={loading ? {width: '200px'} : {width: '350px'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{t('Подтвердить')}</span>
        <IconButton onTouchTap={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <div className={classes.success}>
          Соискател успешно добавлен <br/>
          Данные отправлены на почту
        </div>
        <div className={classes.inContent}>
          <ul>
            <li>Фамилия: </li>
            <li>Имя: </li>
            <li>Очество: </li>
            <li>Email: </li>
          </ul>
          <ul>
            <li>{firstName}</li>
            <li>{lastName}</li>
            <li>{fatherName}</li>
            <li>{email}</li>
          </ul>
        </div>
        <div className={classes.bottomButton}>
          <FlatButton
            label={t('Закрыт')}
            className={classes.actionButton}
            onTouchTap={onClose}
            labelStyle={{fontSize: '13px', color: '#129fdd'}}
            primary={true}/>
        </div>
      </div>
    </Dialog>
  )
})

ApplicantMailDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default ApplicantMailDialog
