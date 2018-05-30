import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

const dateSerializer = (date, format) => {
  const defaultFormat = format || 'YYYY-MM-DD'
  const output = moment(date, defaultFormat, true).format(defaultFormat)
  if (output === 'Invalid date') {
    return null
  }
  return output
}

export const createSerializer = (forms) => {
  const createForm = _.get(forms, 'createForm')
  const educationForm = _.get(forms, 'educationForm')
  const experienceForm = _.get(forms, 'experienceForm')
  const personalForm = _.get(forms, 'personalForm')
  const skillsForm = _.get(forms, 'skillsForm')
  const experiences = _.map(_.get(experienceForm, ['experiences']), (item) => {
    return {
      work_start: dateSerializer(_.get(item, 'workStart')),
      work_end: dateSerializer(_.get(item, 'workEnd')),
      work_till_now: _.get(item, 'workTillNow') || false,
      organization: _.get(item, 'organization'),
      position: _.get(item, ['position', 'value']),
      responsibility: _.get(item, ['responsibility'])
    }
  })
  const educations = _.map(_.get(educationForm, ['educations']), (item) => {
    return {
      education: _.get(item, ['education', 'value']),
      study_start: dateSerializer(_.get(item, 'studyStart')),
      study_end: dateSerializer(_.get(item, 'studyEnd')),
      study_till_now: _.get(item, 'studyTillNow') || false,
      institution: _.get(item, 'institution'),
      speciality: _.get(item, ['speciality']),
      country: _.get(item, ['country', 'value']),
      city: _.get(item, ['city', 'text'])
    }
  })
  const driverLicense = _(skillsForm)
    .get('driverLicense', [])
    .filter((item) => _.get(item, 'active'))
    .map((item) => _.get(item, 'id'))
  const languagesLevel = _(skillsForm)
    .get('languagesLevel', [])
    .filter((item) => !_.isEmpty(item))
    .map((item) => {
      return {
        language: _.get(item, ['name', 'value']),
        level: _.get(item, ['level', 'value'])
      }
    })
  const modes = _(createForm)
    .get('modes', [])
    .filter((item) => _.get(item, 'selected'))
    .map((item) => _.get(item, 'id'))
  return {
    // PERSONAL
    full_name: _.get(personalForm, ['fullName']),
    date_of_birth: dateSerializer(_.get(personalForm, ['dateOfBirth'])),
    sex: _.get(personalForm, ['sex', 'value']),
    family_status: _.get(personalForm, ['familyStatus', 'value']),
    address: _.get(personalForm, ['address']),
    phone: _.get(personalForm, ['phone']),
    email: _.get(personalForm, ['email']),
    country: _.get(personalForm, ['country', 'value']),
    city: _.get(personalForm, ['city', 'text']),
    position: _.get(personalForm, ['position', 'value']),
    // EXPERIENSES
    experiences,
    // EDUCATIONS
    educations,
    // SKILLS
    driver_license: driverLicense,
    languages_level: languagesLevel,
    level_pc: _.get(skillsForm, ['levelPc', 'value']),
    hobby: _.get(skillsForm, ['hobby']),
    // EXPECTATIONS
    modes,
    relocation: _.get(createForm, ['relocation']),
    business_trip: _.get(createForm, ['businessTrip']),
    salary_min: numberWithoutSpaces(_.get(createForm, ['salary', 'min'])),
    salary_max: numberWithoutSpaces(_.get(createForm, ['salary', 'max'])),
    status: _.get(createForm, ['status', 'value']) || 'top',
    skills: _.get(skillsForm, 'skills')
  }
}

export const listFilterSerializer = (data, application, appStatus) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'positions': _.get(defaultData, 'position') || _.get(defaultData, 'sphere'),
    'mode': _.get(defaultData, 'mode'),
    'age_0': _.get(defaultData, 'ageMin'),
    'age_1': _.get(defaultData, 'ageMax'),
    'sex': _.get(defaultData, 'sex'),
    'educations': _.get(defaultData, 'education'),
    'status': _.get(defaultData, 'status'),
    'languages_level': _.get(defaultData, 'languages'),
    'total_exp_0': _.get(defaultData, 'experience'),
    'skills': _.get(defaultData, 'skills'),
    'level_pc': _.get(defaultData, 'levelPc'),
    'application_status': _.get(defaultData, 'appStatus') || appStatus,
    'application': _.get(defaultData, 'application') || application,
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

