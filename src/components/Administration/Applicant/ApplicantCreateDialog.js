import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader/index'
import {COUNTRY_LIST, COUNTRY_ITEM} from '../../../constants/api'
import {APPLICANT_STATUS, PROFILE_LANG} from '../../../constants/backendConstants'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {
  TextField,
  ImageUploadField,
  MaritalStatusSearchField,
  GenderSearchField,
  SphereSearchField,
  DateField,
  UniversalSearchField,
  StaticUniversalSearchField
} from '../../ReduxForm/index'

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
        width: 'calc(100% - 278px)'
      },
      '& > div:nth-child(2)': {
        width: '278px'
      },
      '& .imageDropZone': {
        height: '240px',
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
    'address',
    'countryCode',
    'phoneNumber',
    'photo',
    'email',
    'sphere',
    'martialStatus',
    'birthDate',
    'gender',
    'lang',
    'status'
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
        <IconButton onTouchTap={onClose}>
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
                  component={TextField}
                  label={t('Имя')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="lastName"
                  component={TextField}
                  label={t('Фамилия')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="email"
                  component={TextField}
                  type="email"
                  label={t('email')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <div className={classes.phoneField}>
                  <Field
                    name="countyCode"
                    component={UniversalSearchField}
                    itemPath={COUNTRY_ITEM}
                    listPath={COUNTRY_LIST}
                    label={t('страна')}
                    fullWidth={true}/>
                  <Field
                    name="phoneNumber"
                    component={TextField}
                    label={t('Телефонный номер')}
                    className={classes.inputFieldCustom}
                    fullWidth={true}/>
                </div>
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
                  name="sphere"
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
                  name="martialStatus"
                  component={MaritalStatusSearchField}
                  label={t('Семейное положения')}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="birthDate"
                  component={DateField}
                  label={t('Дата рождение')}
                  className={classes.inputDateCustom}
                  fullWidth={true}/>
              </Col>
            </Row>
            <Field
              name="address"
              component={TextField}
              label={t('Адрес')}
              className={classes.inputFieldCustom}
              fullWidth={true}/>
            <Row className={classes.field}>
              <Col xs={6}>
                <Field
                  name="lang"
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
