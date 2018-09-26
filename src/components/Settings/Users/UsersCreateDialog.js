import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader/index'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {TextField, ImageUploadField, PositionsSearchField, UserStatusRadioButton, RoleSearchField, normalizePhone} from '../../ReduxForm/index'
import formValidate from '../../../helpers/formValidate'

export const USERS_CREATE_DIALOG_OPEN = 'openCreateDialog'

const validateForm = values => {
  const errors = {}
  if (values.password && values.passwordExp && values.password !== values.passwordExp) {
    errors.password = t('Пароли не совпадают')
  }
  return errors
}

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
      padding: '10px 30px'
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
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important'
    },
    subTitle: {
      fontStyle: 'italic',
      margin: '15px 0 10px'
    },
    upperSection: {
      display: 'flex',
      '& .imageDropZone': {
        height: '240px',
        width: '100%',
        marginLeft: '30px'
      }
    },
    status: {
      '& > div:nth-child(2)': {
        width: '65%'
      }

    }
  }),
  reduxForm({
    form: 'UsersCreateForm',
    validate: validateForm,
    enableReinitialize: true
  })
)

const UsersCreateDialog = enhance((props) => {
  const {
    open,
    loading,
    dispatch,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = [
    'firstNameRu',
    'lastNameRu',
    'firstNameEn',
    'lastNameEn',
    'greetingTextRu',
    'greetingTextEn',
    'phoneNumber',
    'photo',
    'email',
    'password'
  ]
  const onSubmit = handleSubmit(() => props.onSubmit()
    .catch((error) => {
      formValidate(formNames, dispatch, error)
    }))
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialogAddUser}
      contentStyle={loading ? {width: '400px'} : {width: '600px'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить пользователя') : t('Добавить пользователя')}</span>
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
            <div className={classes.upperSection}>
              <div>
                <Field
                  name="firstNameRu"
                  component={TextField}
                  label={t('Имя на русском')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="firstNameEn"
                  component={TextField}
                  label={t('Имя на английском')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="lastNameRu"
                  component={TextField}
                  label={t('Фамилия на русском')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="lastNameEn"
                  component={TextField}
                  label={t('Фамилия на английском')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </div>
              <Field
                name="photo"
                component={ImageUploadField}
                label={t('Изображения')}
                fullWidth={true}/>
            </div>
            <Row className={classes.field}>
              <Col xs={6}>
                <Field
                  name="email"
                  component={TextField}
                  type="email"
                  label={t('email') + ' (Логин)'}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="phoneNumber"
                  normalize={normalizePhone}
                  component={TextField}
                  label={t('Телефонный номер')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </Col>
              <Col xs={6}>
                <Field
                  name="passwordExp"
                  component={TextField}
                  type="password"
                  label={isUpdate ? t('Изменить пароль') : t('Пароль')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="password"
                  type="password"
                  component={TextField}
                  label={t('Подтвердите пароль')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>

              </Col>
            </Row>
            <Row className={classes.field}>
              <Col xs={6}>
                <Field
                  name="role"
                  component={RoleSearchField}
                  label={t('Роль сотрудника')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </Col>
              <Col xs={6}>
                <Field
                  name="position"
                  component={PositionsSearchField}
                  label={t('Должность')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </Col>
            </Row>
            <div className={classes.status}>
              <Field
                name="status"
                component={UserStatusRadioButton}
                fullWidth={true}/>
              <Field
                name="greetingRu"
                component={TextField}
                label={t('Текст приветствия в “онлайн консультант (на русском языке)')}
                className={classes.inputFieldCustom}
                fullWidth={true}/>
              <Field
                name="greetingEn"
                component={TextField}
                label={t('Текст приветствия в “онлайн консультант” (на английском языке)')}
                className={classes.inputFieldCustom}
                fullWidth={true}/>
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

UsersCreateDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default UsersCreateDialog
