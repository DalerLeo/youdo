import _ from 'lodash'
import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm} from 'redux-form'
import t from '../../../helpers/translate'
import {connect} from 'react-redux'
import {TextField, DateField} from '../../ReduxForm'
import MaritalStatusSearchField from '../../ReduxForm/Resume/MaritalStatusSearchField'
import GenderSearchField from '../../ReduxForm/GenderSearchField'
import SphereSearchField from '../../ReduxForm/HR/Sphere/SphereSearchField'
import PositionSearchField from '../../ReduxForm/HR/Sphere/PositionSearchField'
import CountrySearchField from '../../ReduxForm/HR/CountrySearchField'
import CitySearchField from '../../ReduxForm/HR/CitySearchField'

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
    'sphere',
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
  injectSheet({}),
  connect((state) => {
    const country = _.get(state, ['form', 'ResumePersonalForm', 'values', 'country', 'value'])
    const sphere = _.get(state, ['form', 'ResumePersonalForm', 'values', 'sphere', 'value'])
    return {
      country,
      sphere
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
  })
)

const ResumeCreatePersonal = enhance((props) => {
  const {
    classes,
    country,
    sphere,
    nextButton
  } = props

  return (
    <div>
      <h4>{t('Личные данные')}</h4>
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
      <Field
        name="familyStatus"
        label={t('Семейное положение')}
        component={MaritalStatusSearchField}
        className={classes.inputFieldCustom}
        fullWidth={true}/>
      <Field
        name="address"
        label={t('Адрес проживания')}
        component={TextField}
        className={classes.inputFieldCustom}
        fullWidth={true}/>
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
      <Field
        name="country"
        label={t('Страна проживания')}
        component={CountrySearchField}
        className={classes.inputFieldCustom}
        fullWidth={true}/>
      {country &&
            <Field
              name="city"
              label={t('Город')}
              component={CitySearchField}
              params={{country: country}}
              className={classes.inputFieldCustom}
              fullWidth={true}/>}
      <Field
        name="sphere"
        label={t('Желаемая специальность')}
        component={SphereSearchField}
        className={classes.inputFieldCustom}
        params={{only_parent: true, ordering: 'name'}}
        fullWidth={true}/>
      {sphere &&
            <Field
              name="position"
              label={t('Должность')}
              component={PositionSearchField}
              className={classes.inputFieldCustom}
              params={{child: sphere, ordering: 'name'}}
              fullWidth={true}/>}
      {nextButton}
    </div>
  )
})

export default ResumeCreatePersonal
