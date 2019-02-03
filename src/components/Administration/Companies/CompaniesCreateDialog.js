import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {ImageUploadField, TextField, CheckBox, SphereSearchField, CheckBoxGroup} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../../helpers/translate'
import formValidate from '../../../helpers/formValidate'
import CompanyUsersField from './CompanyUsersField'

export const COMPANIES_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
  injectSheet({
    dialog: {
      overflowY: 'auto'
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
    inContent: {
      padding: '0 30px 20px',
      color: '#333'
    },
    bodyContent: {
      width: '100%'
    },
    form: {
      position: 'relative'
    },
    subTitle: {
      fontWeight: '600',
      marginBottom: '10px'
    },
    field: {
      width: '100%'
    },
    flexField: {
      display: 'flex'
    },
    imageField: {
      marginLeft: '15px',
      minWidth: '150px',
      width: '150px',
      '& > div': {
        height: '100%'
      },
      '& .imageDropZone': {
        marginTop: '-6px',
        height: '100%',
        width: '100%'
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
    inputDateCustom: {
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
      },
      '& div:first-child': {
        height: '45px !important'
      }
    },
    textFieldArea: {
      top: '-20px !important',
      lineHeight: '20px !important',
      marginBottom: '-20px',
      fontSize: '13px !important',
      '& textarea': {
        overflow: 'hidden'
      }
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
    }
  }),
  reduxForm({
    form: 'CompaniesCreateForm',
    enableReinitialize: true
  })
)

const CompaniesCreateDialog = enhance((props) => {
  const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate} = props
  const formNames = ['title', 'text']
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
      bodyStyle={{minHeight: 'auto'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменение компании') : t('Добавление компании')}</span>
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
            <div className={classes.subTitle}>{t('Основная информация')}</div>
            <div className={classes.flexField}>
              <div className={classes.field}>
                <Field
                  name="kind"
                  component={TextField}
                  className={classes.inputFieldCustom}
                  label={t('Форма организации')}
                  fullWidth/>
                <Field
                  name="name"
                  component={TextField}
                  className={classes.inputFieldCustom}
                  label={t('Название')}
                  fullWidth/>
                <Field
                  name="description"
                  component={TextField}
                  className={classes.textFieldArea}
                  label={t('Информация о компании')}
                  fullWidth
                  multiLine
                  rows={1}/>
              </div>
              <div className={classes.imageField}>
                <Field
                  name="image"
                  component={ImageUploadField}/>
              </div>
            </div>
            <Field
              name="activityField"
              component={SphereSearchField}
              className={classes.inputFieldCustom}
              label={t('Сфера деятельности')}
              params={{only_parent: true}}
              fullWidth/>
            <Field
              name="hrAgency"
              component={CheckBox}
              label={t('Кадровое агентсво')}/>
            <Field
              name="hrAgency"
              items={[{name: 'hey', id: 3}, {name: 'mey', id: 2}]}
              component={CheckBoxGroup}
              label={t('Magent')}/>
            <FieldArray
              name="users"
              component={CompanyUsersField}/>
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

CompaniesCreateDialog.propTypes = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

CompaniesCreateDialog.defaultProps = {
  isUpdate: false
}

export default CompaniesCreateDialog
