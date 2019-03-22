import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from 'components/Loader'
import {Field, reduxForm, Fields} from 'redux-form'
import * as API from 'constants/api'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
  TextField,
  normalizePhone,
  UniversalSearchField
} from 'components/ReduxForm'

import OrderList from 'components/ReduxForm/OrderList'

export const APPLICANT_CREATE_DIALOG_OPEN = 'openCreateDialog'

const validateForm = values => {
  const errors = {}
  if (values.password && values.passwordExp && values.password !== values.passwordExp) {
    errors.password = 'Пароли не совпадают'
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
        height: '140px',
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
    form: 'CustomerCreateForm',
    validate: validateForm,
    enableReinitialize: true
  })
)

const OrderCreateDialog = enhance((props) => {
  const {
    open,
    loading,
    handleSubmit,
    onClose,
    classes,
    isUpdate
  } = props

  const formNames = [
    'fullName',
    'phoneNumber',
    'email'
  ]
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialogAddUser}
      contentStyle={loading ? {width: '300px'} : {width: '500px'}}
      bodyClassName={classes.popUp}>
      <div className={classes.titleContent}>
        <span>{isUpdate ? 'Изменить пользователя' : 'Добавить пользователя'}</span>
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
                  name="clientName"
                  component={TextField}
                  label={'ФИО'}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="address"
                  label={'Address'}
                  component={TextField}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="phoneNumber"
                  normalize={normalizePhone}
                  component={TextField}
                  label={'Телефонный номер'}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="district"
                  component={UniversalSearchField}
                  listPath={API.REGIONS_LIST}
                  itemPath={API.REGIONS_ITEM}
                  params={{'type': 'district'}}
                  label={'District'}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <Field
                  name="master"
                  component={UniversalSearchField}
                  listPath={API.APPLICANT_LIST}
                  itemPath={API.APPLICANT_ITEM}
                  textName={'fullName'}
                  label={'Master'}
                  className={classes.inputFieldCustom}
                  fullWidth={true}/>
                <div>
                  <Fields component={OrderList} names={['item', 'service', 'services'] }/>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.bottomButton}>
            <FlatButton
              label={'Сохранить'}
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

OrderCreateDialog.propTyeps = {
  isUpdate: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default OrderCreateDialog
