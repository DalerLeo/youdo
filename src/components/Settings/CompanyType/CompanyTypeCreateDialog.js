import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Field, reduxForm} from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {TextField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../../Styles/MainStyles'
import t from '../../../helpers/translate'

export const COMPANY_TYPE_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
    }
  })),
  reduxForm({
    form: 'CompanyTypeCreateForm',
    enableReinitialize: true
  })
)

const CompanyTypeCreateDialog = enhance((props) => {
  const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
  const onSubmit = handleSubmit(() => props.onSubmit())

  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={loading ? {width: '300px'} : {width: '500px'}}
      bodyStyle={{minHeight: 'auto'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить тип продукта') : t('Добавить тип продукта')}</span>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent} style={{minHeight: '100px', paddingTop: '15px'}}>
            <div className={classes.field}>
              <Field
                name="name"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Наименование услуги')}
                fullWidth={true}
              />
              <Field
                name="price"
                component={TextField}
                className={classes.inputFieldCustom}
                label={t('Цена')}
                fullWidth={true}
              />
            </div>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={t('Сохранить')}
              className={classes.actionButton}
              labelStyle={{fontSize: '13px'}}
              primary={true}
              type="submit"
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
})

CompanyTypeCreateDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

CompanyTypeCreateDialog.defaultProps = {
  isUpdate: false
}

export default CompanyTypeCreateDialog
