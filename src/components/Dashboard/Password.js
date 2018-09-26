import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../ReduxForm'
import validate from '../../helpers/validate'

const enhance = compose(
  injectSheet({
    textField: {
      fontSize: '13px !important',
      paddingLeft: '10px',
      marginRight: '10px',
      width: '160px !important'
    },
    chartHeader: {
      position: 'relative',
      padding: '15px 20px 15px 30px',
      fontWeight: '600',
      borderBottom: '1px #efefef solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& svg': {
        cursor: 'pointer',
        width: '18px !important',
        height: '18px !important'
      }
    },
    chart: {
      display: 'flex'
    },
    currentPass: {
      padding: '20px 30px',
      borderRight: '1px #efefef solid',
      width: '60%'
    },
    newPass: {
      display: 'flex',
      padding: '20px',
      flexDirection: 'column-reverse',
      width: '40%'
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
    }
  }),
  connect((state) => {
    const password1 = _.get(state, ['form', 'DashboardPasswordForm', 'values', 'newPassword'])
    const password2 = _.get(state, ['form', 'DashboardPasswordForm', 'values', 'newPasswordConfirm'])
    return {password1, password2}
  }),
  reduxForm({
    form: 'DashboardPasswordForm',
    enableReinitialize: true
  })
)

const Password = enhance((props) => {
  const {
    classes,
    password1,
    password2,
    setOpenEditPass,
    handleSubmit,
    handleChangePassword
  } = props

  const showError = Boolean(password1 !== password2 && password2)
  const errorText = 'Пароли не соответствуют'
  const onSubmit = handleSubmit(() => handleChangePassword().catch(validate))
  const disabledButton = showError || !password2

  return (
    <Paper zDepth={1}>
      <div className={classes.chartHeader}>
        <div>Изменение пароля</div>
        <CloseIcon color={'#666'} onClick={() => { setOpenEditPass(false) }}/>
      </div>
      <form className={classes.chart} onSubmit={onSubmit}>
        <div className={classes.currentPass}>
          <Field
            name="currentPassword"
            type="password"
            component={TextField}
            label="Текущий пароль"
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <Field
            name="newPassword"
            type="password"
            component={TextField}
            label="Новый пароль"
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <Field
            errorText={showError ? errorText : ''}
            name="newPasswordConfirm"
            type="password"
            component={TextField}
            label="Подтвердите пароль"
            className={classes.inputFieldCustom}
            fullWidth={true}/>
        </div>
        <div className={classes.newPass}>
          <FlatButton
            label="Сохранить"
            type={'submit'}
            backgroundColor={disabledButton ? '#bebebe' : '#12aaeb'}
            hoverColor={'#12aaeb'}
            rippleColor={'#fff'}
            labelStyle={{color: '#fff', textTransform: 'none', fontWeight: '600', verticalAlign: 'baseline'}}
            disabled={disabledButton}
            fullWidth={true}/>
        </div>
      </form>
    </Paper>
  )
})

export default Password
