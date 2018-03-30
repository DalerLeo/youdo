import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import {HR_RESUME_MEETING} from '../../constants/backendConstants'

const dateSerializer = (date, format) => {
    const defaultFormat = format || 'YYYY-MM-DD'
    const output = moment(date, defaultFormat, true).format(defaultFormat)
    if (output === 'Invalid date') {
        return null
    }
    return output
}

export const createLongSerializer = (data) => {
    const resumes = _.filter(_.map(_.get(data, 'resumes'), (item, index) => {
        return _.get(item, 'selected') ? index : null
    }), (item) => !_.isNull(item))
    return {
        resume: resumes,
        status: 'long'
    }
}

export const createMoveToSerializer = (application, resume, moveTo, data) => {
    const date = dateSerializer(_.get(data, 'date'))
    const time = moment(_.get(data, 'time')).format('HH:mm')
    const note = _.get(data, 'note')
    const request = {
        application,
        resume,
        note,
        status: moveTo
    }
    return moveTo === HR_RESUME_MEETING
        ? _.merge(request, {date_time: date + ' ' + time})
        : request
}

export const removeResumeSerializer = (resume, data) => {
    const note = _.get(data, 'note')
    return {
        resume: [resume],
        note
    }
}

export const resumeListFilterSerializer = (data, application, appStatus) => {
    const {...defaultData} = data
    const applicationStatus = application + '-' + appStatus

    return {
        'application': applicationStatus,
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

export const createNoteSerializer = (resume, note) => {
    return {
        resume,
        note
    }
}

export const resumePreviewFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'update': _.get(defaultData, 'application'),
        'exclude_accepted': true,
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

