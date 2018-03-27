import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

const dateSerializer = (date, format) => {
    const defaultFormat = format || 'YYYY-MM-DD'
    const output = moment(date, defaultFormat, true).format(defaultFormat)
    if (output === 'Invalid date') {
        return null
    }
    return output
}

export const createSerializer = (data) => {
    const experiences = _.map(_.get(data, ['experiences']), (item) => {
        return {
            work_start: dateSerializer(_.get(item, 'workStart')),
            work_end: dateSerializer(_.get(item, 'workEnd')),
            work_till_now: _.get(item, 'workTillNow') || false,
            organization: _.get(item, 'organization'),
            position: _.get(item, ['position', 'value']),
            responsibility: _.get(item, ['responsibility'])
        }
    })
    const educations = _.map(_.get(data, ['educations']), (item) => {
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
    const driverLicense = _(data)
        .get('driverLicense', [])
        .filter((item) => _.get(item, 'active'))
        .map((item) => _.get(item, 'id'))
    const languagesLevel = _(data)
        .get('languagesLevel', [])
        .filter((item) => !_.isEmpty(item))
        .map((item) => {
            return {
                language: _.get(item, ['name', 'value']),
                level: _.get(item, ['level', 'value'])
            }
        })
    const modes = _(data)
        .get('modes')
        .filter((item) => _.get(item, 'selected'))
        .map((item) => _.get(item, 'id'))
    return {
        // PERSONAL
        full_name: _.get(data, ['fullName']),
        date_of_birth: dateSerializer(_.get(data, ['dateOfBirth'])),
        sex: _.get(data, ['sex', 'value']),
        family_status: _.get(data, ['familyStatus', 'value']),
        address: _.get(data, ['address']),
        phone: _.get(data, ['phone']),
        email: _.get(data, ['email']),
        country: _.get(data, ['country', 'value']),
        city: _.get(data, ['city', 'text']),
        position: _.get(data, ['position', 'value']),
        // EXPERIENSES
        experiences,
        // EDUCATIONS
        educations,
        // SKILLS
        driver_license: driverLicense,
        languages_level: languagesLevel,
        level_pc: _.get(data, ['levelPc', 'value']),
        hobby: _.get(data, ['hobby']),
        // EXPECTATIONS
        modes,
        relocation: _.get(data, ['relocation']),
        business_trip: _.get(data, ['businessTrip']),
        salary_min: _.get(data, ['salary', 'min']),
        salary_max: _.get(data, ['salary', 'max']),
        status: 'top'
    }
}

export const listFilterSerializer = (data, application, appStatus) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'positions': _.get(defaultData, 'position'),
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

