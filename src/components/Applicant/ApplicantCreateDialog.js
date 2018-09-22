import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {COUNTRY_LIST, COUNTRY_ITEM} from '../../constants/api'
import {APPLICANT_STATUS, PROFILE_LANG, ACTIVITY_STATUS} from '../../constants/backendConstants'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../helpers/translate'
import {
  TextFieldCustom,
  ImageUploadField,
  MaritalStatusSearchField,
  GenderSearchField,
  SphereSearchField,
  DateCustomField,
  UniversalSearchField,
  StaticUniversalSearchField
} from '../ReduxForm'

export const APPLICANT_CREATE_DIALOG_OPEN = 'openCreateDialog'
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
      '& > div:first-child': {
        width: 'calc(100% - 220px)'
      },
      '& > div:nth-child(2)': {
        width: '220px'
      },
      '& .imageDropZone': {
        height: '150px',
        width: '100%',
        marginLeft: '30px'
      }
    },
    status: {
      '& > div:nth-child(3)': {
        width: '65%'
      }
    },
    inputDateCustom: {
      fontSize: '13px !important',
      height: '45px !important',
      marginTop: '14px',
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
    lastBlock: {
      alignItems: 'center',
      justifyContent: 'space-between',
      display: 'flex'
    },
    phoneField: {
      display: 'flex',
      alignItems: 'flex-end',
      '& > div:first-child': {
        width: '150px',
        marginRight: '10px'
      }
    }
  }),
  reduxForm({
    form: 'ApplicantCreateForm',
    enableReinitialize: true
  })
)

const ApplicantCreateDialog = enhance((props) => {
  const {
    open,
    loading,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = [
    'firstName',
    'lastName',
    'secondName',
    'address',
    'phone',
    'phoneCode',
    'image',
    'email',
    'sphere',
    'maritalStatus',
    'birthday',
    'gender',
    'profileLanguage',
    'interestLevel',
    'status',
    'activityField'
  ]
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialogAddUser}
      contentStyle={loading ? {width: '400px'} : {width: '600px'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? t('Изменить соискателя') : t('Добавить соискателя')}</span>
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
                  name="firstName"
                  component={TextFieldCustom}
                  label={t('Имя')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="lastName"
                  component={TextFieldCustom}
                  label={t('Фамилия')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="email"
                  component={TextFieldCustom}
                  type="email"
                  label={t('email')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </div>
              <Field
                name="image"
                component={ImageUploadField}
                label={t('Изображения')}
                fullWidth={true}/>
            </div>
            <Row className={classes.field}>
              <Col xs={6}>
                <div className={classes.phoneField}>
                  <Field
                    name="phoneCode"
                    component={UniversalSearchField}
                    itemPath={COUNTRY_ITEM}
                    listPath={COUNTRY_LIST}
                    label={t('страна')}
                    fullWidth={true}/>
                  <Field
                    name="phone"
                    component={TextFieldCustom}
                    label={t('Телефонный номер')}
                    className={classes.inputFieldCustom}
                    fullWidth={true}/>
                </div>
              </Col>
              <Col xs={6}>
                <Field
                  name="interestLevel"
                  component={StaticUniversalSearchField}
                  label={t('Заинтересованность')}
                  items={ACTIVITY_STATUS}
                  fullWidth={true}/>
              </Col>
            </Row>
            <Row className={classes.field}>
              <Col xs={6}>
                <Field
                  name="activityField"
                  component={SphereSearchField}
                  label={t('Профессионалная сфера')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="gender"
                  component={GenderSearchField}
                  label={t('Пол')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
              </Col>
              <Col xs={6}>
                <Field
                  name="maritalStatus"
                  component={MaritalStatusSearchField}
                  label={t('Семейное положения')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="birthday"
                  component={DateCustomField}
                  label={t('Дата рождение')}
                  className={classes.inputDateCustom}
                  fullWidth={true}/>
              </Col>
            </Row>
            <Field
              name="address"
              component={TextFieldCustom}
              label={t('Адрес')}
              className={classes.inputFieldCustom}
              fullWidth={true}/>
            <Row className={classes.field}>
              <Col xs={6}>
                <Field
                  name="profileLanguage"
                  component={StaticUniversalSearchField}
                  label={t('Язык профиля')}
                  items={PROFILE_LANG}
                  fullWidth={true}/>
              </Col>
              <Col xs={6}>
                <Field
                  name="status"
                  label={'Статус'}
                  component={StaticUniversalSearchField}
                  items={APPLICANT_STATUS}
                  fullWidth={true}/>
              </Col>
            </Row>
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

ApplicantCreateDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default ApplicantCreateDialog
