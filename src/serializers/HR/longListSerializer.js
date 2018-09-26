import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {
  HR_RESUME_LONG,
  HR_RESUME_MEETING,
  HR_RESUME_REPORT,
  HR_RESUME_SHORT
} from '../../constants/backendConstants'
const dateSerializer = (date, format) => {
  const defaultFormat = format || 'YYYY-MM-DD'
  const output = moment(date, defaultFormat, true).format(defaultFormat)
  if (output === 'Invalid date') {
    return null
  }
  return output
}
export const createLongSerializer = (application, data) => {
  const resumes = _.filter(_.map(_.get(data, 'resumes'), (item, index) => {
    return _.get(item, 'selected') ? index : null
  }), (item) => !_.isNull(item))
  return {
    application,
    resume: resumes,
    status: HR_RESUME_LONG
  }
}

export const createReportSerializer = (application, resumes) => {
  return {
    application,
    resume: resumes,
    status: HR_RESUME_REPORT
  }
}

export const createShortSerializer = (application, resumes) => {
  return {
    application,
    resume: resumes,
    status: HR_RESUME_SHORT
  }
}

export const createMoveToSerializer = (application, resume, datetime, statusToChange, currentStatus, data) => {
  const date = datetime || moment(_.get(data, 'date')).format('YYYY-MM-DD')
  const time = _.get(data, 'time')
  const note = _.get(data, 'note')
  const request = {
    application,
    resume,
    note,
    status: statusToChange
  }
  return statusToChange === HR_RESUME_MEETING
    ? _.merge(request, {date_time: date + ' ' + time})
    : request
}

export const resumeListFilterSerializer = (data, application, appStatus) => {
  const {...defaultData} = data
  const applicationStatus = application + '-' + appStatus
  const completed = appStatus === 'meeting' ? _.get(data, 'completed') : null
  return {
    'application': applicationStatus,
    completed,
    'page_size': _.get(defaultData, 'pageSize')
  }
}

export const createCommentSerializer = (resume, data) => {
  const comment = _.get(data, 'comment')
  return {
    resume,
    comment
  }
}

export const createNoteSerializer = (application, resume, note, status, {date, time}) => {
  const dateTime = date + ' ' + time
  const request = {
    application,
    resume,
    status,
    note
  }
  return status === HR_RESUME_MEETING ? _.merge(request, {date_time: dateTime}) : request
}

export const resumePreviewFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'update': _.get(defaultData, 'application'),
    'exclude_accepted': _.get(defaultData, 'application'),
    'positions': _.get(defaultData, 'positions'),
    'mode': _.get(defaultData, 'mode'),
    'age_0': _.get(defaultData, 'age0'),
    'age_1': _.get(defaultData, 'age1'),
    'sex': _.get(defaultData, 'sex'),
    'educations': _.get(defaultData, 'educations'),
    'status': _.get(defaultData, 'status'),
    'languages_level': _.get(defaultData, 'langLevel'),
    'total_exp_0': _.get(defaultData, 'totalExp0'),
    'skills': _.get(defaultData, 'skills'),
    'level_pc': _.get(defaultData, 'levelPc'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

export const resumeCommentsSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'resume': _.get(defaultData, 'resume'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize') || '20',
    'ordering': orderingSnakeCase(ordering) || '-created_date'
  }
}

export const createQuestionsSerializer = (application, data) => {
  const questions = _.filter(_.map(_.get(data, 'questions'), (item) => {
    return _.get(item, 'question')
  }), (item) => {
    return !_.isEmpty(item)
  })

  return {
    application,
    questions
  }
}

export const questionsListSerializer = (application) => {
  return {
    application,
    page_size: 20,
    ordering: 'id'
  }
}

export const sendAnswersSerializer = (application, resume, data) => {
  const answers = _.map(_.get(data, 'answers'), (item, index) => {
    const answer = _.get(item, 'answer')
    return {
      question: _.toNumber(index),
      answer
    }
  })
  // .. const newAnswers = _.map(_.get(data, 'newQuestions'), (item) => {
  // ..     const question = _.get(item, 'question')
  // ..     const answer = _.get(item, 'answer')
  // ..     return {
  // ..         application,
  // ..         resume,
  // ..         question,
  // ..         answer
  // ..     }
  // .. })
  // .. const filteredNewAnswers = _.filter(newAnswers, (item) => _.get(item, 'answer') && _.get(item, 'question'))

  return {
    application,
    resume,
    answers
  }
}

export const answersListSerializer = (application, resume) => {
  return {
    resume,
    application,
    page_size: 20
  }
}

export const updateReportSerializer = (application, reportIds, shortIds) => {
  const reportListArray = _.map(reportIds, (item) => {
    return {
      application,
      resume: item,
      status: HR_RESUME_REPORT
    }
  })
  const shortListArray = _.map(shortIds, (item) => {
    return {
      application,
      resume: item,
      status: HR_RESUME_SHORT
    }
  })
  return _.concat(reportListArray, shortListArray)
}

export const updateResumeSerializer = (forms) => {
  const createForm = _.get(forms, 'createForm')
  const educationForm = _.get(forms, 'educationForm')
  const experienceForm = _.get(forms, 'experienceForm')
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
  const driverLicense = _(createForm)
    .get('driverLicense', [])
    .filter((item) => _.get(item, 'active'))
    .map((item) => _.get(item, 'id'))
  const languagesLevel = _(createForm)
    .get('languagesLevel', [])
    .filter((item) => !_.isEmpty(item))
    .map((item) => {
      return {
        language: _.get(item, ['name', 'value']),
        level: _.get(item, ['level', 'value'])
      }
    })
  return {
    // PERSONAL
    full_name: _.get(createForm, ['fullName']),
    date_of_birth: dateSerializer(_.get(createForm, ['dateOfBirth'])),
    sex: _.get(createForm, ['sex', 'value']),
    family_status: _.get(createForm, ['familyStatus', 'value']),
    address: _.get(createForm, ['address']),
    phone: _.get(createForm, ['phone']),
    email: _.get(createForm, ['email']),
    skills: _.get(createForm, ['skills']),
    country: _.get(createForm, ['country', 'value']),
    city: _.get(createForm, ['city', 'text']),
    position: _.get(createForm, ['position', 'value']),
    // EXPERIENSES
    experiences,
    // EDUCATIONS
    educations,
    // SKILLS
    driver_license: driverLicense,
    languages_level: languagesLevel,
    level_pc: _.get(createForm, ['levelPc', 'value']),
    hobby: _.get(createForm, ['hobby']),
    // EXPECTATIONS
    relocation: _.get(createForm, ['relocation']),
    business_trip: _.get(createForm, ['businessTrip']),
    salary_min: numberWithoutSpaces(_.get(createForm, ['salary', 'min'])),
    salary_max: numberWithoutSpaces(_.get(createForm, ['salary', 'max'])),
    status: 'top'
  }
}
