import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {TextField, CheckBox} from '../ReduxForm'
import ClientContactsListField from '../ReduxForm/Client/ClientContactsListField'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

export const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const CLIENT_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

const enhance = compose(
  injectSheet(_.merge(MainStyles, {
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
    },
    textFieldArea: {
      top: '-20px !important',
      lineHeight: '20px !important',
      fontSize: '13px !important',
      marginBottom: '-22px'
    },
    contacts: {
      background: '#f1f5f8',
      color: '#333',
      margin: '12px -30px 0',
      padding: '20px 30px'
    }
  })),
  reduxForm({
    form: 'ClientCreateForm',
    enableReinitialize: true
  })
)

const ClientCreateDialog = enhance((props) => {
  const {open, loading, handleSubmit, onClose, classes, isUpdate, dispatch} = props
  const formNames = ['name', 'address', 'from', 'inBlackList']
  const onSubmit = handleSubmit(() => props.onSubmit()
    .catch((error) => {
      formValidate(formNames, dispatch, error)
    }))

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={loading ? {width: '300px'} : {width: '500px'}}
      bodyClassName={classes.popUp}>

      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменение клиента') : t('Добавление клиента')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent} style={{minHeight: '300px', paddingBottom: '0'}}>
            <div className={classes.field} style={{padding: '10px 0 0'}}>
              <Field
                name="name"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Организация')}
                fullWidth={true}/>
              <Field
                name="sphere"
                component={TextField}
                className={classes.textFieldArea}
                label={t('Сфера деятельности')}
                fullWidth={true}
                multiLine={true}
                rows={1}/>
              <Field
                name="address"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Местположение')}
                fullWidth={true}/>

              <div className={classes.contacts}>
                {t('Контактные данные')}
                <FieldArray
                  name="contacts"
                  component={ClientContactsListField}
                />
              </div>
              <div style={{padding: '10px 0'}}>
                <Field
                  name="inBlacklist"
                  component={CheckBox}
                  label={t('Добавить в черный список')}
                  fullWidth={true}/>
              </div>
            </div>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Сохранить')}
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

ClientCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

ClientCreateDialog.defaultProps = {
  isUpdate: false
}

export default ClientCreateDialog
