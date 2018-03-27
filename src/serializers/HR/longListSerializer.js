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
    const resumes = _.filter(_.map(_.get(data, 'resumes'), (item, index) => {
        return _.get(item, 'selected') ? index : null
    }), (item) => !_.isNull(item))
    console.warn(resumes)
    return {
        resume: resumes,
        status: 'long'
    }
}

export const resumeListFilterSerializer = (data, application, appStatus) => {
    const {...defaultData} = data

    return {
        'application_status': _.get(defaultData, 'appStatus') || appStatus,
        'application': _.get(defaultData, 'application') || application,
        'page_size': _.get(defaultData, 'pageSize')
    }
}

export const resumePreviewFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
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

