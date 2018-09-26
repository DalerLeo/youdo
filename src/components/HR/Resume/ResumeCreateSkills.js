import _ from 'lodash'
import React from 'react'
import {compose, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {Field, FieldArray, reduxForm} from 'redux-form'
import t from '../../../helpers/translate'
import {TextField} from '../../ReduxForm'
import ComputerLevelSearchField from '../../ReduxForm/HR/ComputerLevelSearchField'
import LanguageField from '../../ReduxForm/HR/LanguageField'
import DriverLicenceCheck from '../../ReduxForm/Resume/DriverLicenceCheck'
import SkillsTagSearchField from '../../ReduxForm/HR/SkillsTagSearchField'

const validate = values => {
  const formNames = [
    'levelPc'
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
  reduxForm({
    form: 'ResumeSkillsForm',
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate
  }),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      const props = this.props
      if ((props.invalid !== nextProps.invalid)) {
        nextProps.updateSkillsError(nextProps.invalid)
      }
    }
  })
)

const ResumeCreateSkills = enhance((props) => {
  const {
    classes,
    nextButton,
    skillsError,
    updateSkillsError
  } = props

  return (
    <div>
      <h4>{t('Навыки и умения')}</h4>
      <Field
        name="driverLicense"
        component={DriverLicenceCheck}/>
      <FieldArray
        name="languagesLevel"
        component={LanguageField}
        skillsError={skillsError}
        updateSkillsError={updateSkillsError}/>
      <Field
        name="levelPc"
        component={ComputerLevelSearchField}
        className={classes.inputFieldCustom}
        label={t('Уровень владения ПК')}
        fullWidth={true}/>
      <Field
        name="hobby"
        component={TextField}
        className={classes.textFieldArea}
        label={t('Интересы и хобби')}
        fullWidth={true}
        multiLine={true}
        rows={1}/>
      <Field
        name="skills"
        component={SkillsTagSearchField}
        className={classes.inputFieldCustom}
        label={t('Профессиональные навыки')}
        fullWidth={true}/>
      {nextButton}
    </div>
  )
})

export default ResumeCreateSkills
