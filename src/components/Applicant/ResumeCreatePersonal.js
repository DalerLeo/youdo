import _ from 'lodash'
import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm} from 'redux-form'
import t from '../../helpers/translate'
import {connect} from 'react-redux'
import {TextField, DateField} from '../ReduxForm'
import MaritalStatusSearchField from '../ReduxForm/HR/Resume/MaritalStatusSearchField'
import GenderSearchField from '../ReduxForm/HR/GenderSearchField'
import PositionSearchField from '../ReduxForm/HR/Position/PositionSearchField'
import CountrySearchField from '../ReduxForm/HR/CountrySearchField'
import ImageUploadField from '../ReduxForm/Basic/ImageUploadField'
import Editor from '../ReduxForm/Editor/Editor'

const validate = values => {
  const formNames = [
    'fullName',
    'dateOfBirth',
    'sex',
    'familyStatus',
    'address',
    'phone',
    'email',
    'country',
    'city',
    'position'
  ]
  const errors = {}
  const getError = (field) => {
    if (!_.get(values, field)) {
      errors[field] = t('Обязательное поле')
    }
  }
  _.map(formNames, (item) => getError(item))
  return errors
}

const enhance = compose(
  connect((state) => {
    const country = _.get(state, ['form', 'ResumePersonalForm', 'values', 'country', 'value'])
    return {
      country
    }
  }),
  reduxForm({
    form: 'ResumePersonalForm',
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate
  }),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      const props = this.props
      if ((props.invalid !== nextProps.invalid)) {
        nextProps.updatePersonalError(nextProps.invalid)
      }
    }
  }),
  injectSheet({
    firstBlock: {
      display: 'flex',
      '& > div:first-child': {
        width: '160px',
        marginRight: '30px',
        paddingBottom: '0',
        '& .imageDropZone': {
          width: '100%',
          height: '155px'
        }
      },
      '& > div:last-child': {
        width: 'calc(100% - 160px)'
      }
    },
    flexMargin: {
      display: 'flex',
      alignItems: 'flex-end',
      '& > div:nth-child(1)': {
        marginRight: '20px'
      },
      '& > div:last-child': {
        leftRight: '20px'
      }
    }
  }),
)

const ResumeCreatePersonal = enhance((props) => {
  const {
    classes,
    nextButton
  } = props

  return (
    <div>
      <h4>{t('Личные данные')}</h4>
      <div className={classes.firstBlock}>
        <Field
          name="Фото"
          label={t('Ф.И.О')}
          component={ImageUploadField}
          className={''}/>
        <div>
          <Field
            name="fullName"
            label={t('Ф.И.О')}
            component={TextField}
            className={classes.inputFieldCustom}
            fullWidth={true}/>
          <Field
            name="dateOfBirth"
            label={t('Дата рождения')}
            component={DateField}
            className={classes.inputDateCustom}
            errorStyle={{bottom: 2}}
            fullWidth={true}/>
          <Field
            name="sex"
            label={t('Пол')}
            component={GenderSearchField}
            className={classes.inputFieldCustom}
            removeNoMatter={true}
            fullWidth={true}/>
        </div>
      </div>
      <div className={classes.flexMargin}>
        <Field
          name="lang"
          label={t('Язык профиля')}
          component={CountrySearchField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
        <Field
          name="familyStatus"
          label={t('Семейное положение')}
          component={MaritalStatusSearchField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
      </div>
      <div className={classes.flexMargin}>
        <Field
          name="status"
          label={t('Статус поиска работы')}
          component={CountrySearchField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
        <Field
          name="balance"
          label={t('Баланс')}
          component={TextField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
      </div>
      <div className={classes.flexMargin}>
        <Field
          name="country"
          label={t('Страна проживания')}
          component={CountrySearchField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
        <Field
          name="address"
          label={t('Город')}
          component={TextField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
      </div>
      <div className={classes.flexMargin}>
        <Field
          name="phone"
          label={t('Телефонный номер')}
          component={TextField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
        <Field
          name="email"
          label={t('Email адрес')}
          component={TextField}
          className={classes.inputFieldCustom}
          fullWidth={true}/>
      </div>
      <Field
        name="position"
        label={t('Желаемая специальность')}
        component={PositionSearchField}
        className={classes.inputFieldCustom}
        fullWidth={true}/>
      <Field
        name="about"
        component={Editor}
        label={'О себе'}/>

      {nextButton}
    </div>
  )
})

export default ResumeCreatePersonal
