import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

export const createSerializer = (data) => {
    const ageMin = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'min'])))
    const ageMax = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'max'])))
    const businessTrip = _.get(data, ['businessTrip'])
    const contact = _.toNumber(_.get(data, ['contact']))
    const education = _.get(data, ['education', 'value'])
    const experience = _.toNumber(_.get(data, ['experience']))
    const responsibility = _.get(data, ['responsibility'])
    const position = _.get(data, ['position', 'value'])
    const planningDate = moment(_.get(data, ['planningDate'])).format('YYYY-MM-DD')
    const deadlineDate = moment(_.get(data, ['deadline'])).format('YYYY-MM-DD HH:mm')
    const trialSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'min'])))
    const trialSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'max'])))
    const realSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'min'])))
    const realSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'max'])))
    const compLevel = _.get(data, ['levelPc', 'value'])
    const languages = _.map(_.get(data, 'languages'), (item) => {
        return {
            language: _.get(item, ['name', 'value']),
            level: _.get(item, ['level', 'value'])
        }
    })
    const sex = _.get(data, ['sex', 'value'])
    const recruiter = _.get(data, ['recruiter', 'id'])
    const mode = _.get(data, ['schedule', 'value'])
    const privileges = _(data)
        .get('privileges')
        .filter((item) => _.get(item, 'selected'))
        .map((item) => _.get(item, 'id'))
    const skills = _.filter(_.get(data, 'skills'), (item) => item)
    return {
        age_min: ageMin,
        age_max: ageMax,
        business_trip: businessTrip,
        contact,
        education,
        experience,
        deadline: deadlineDate,
        languages_level: languages,
        level_pc: compLevel,
        responsibility,
        position,
        planning_date: planningDate,
        privileges,
        trial_salary_min: trialSalaryMin,
        trial_salary_max: trialSalaryMax,
        real_salary_min: realSalaryMin,
        real_salary_max: realSalaryMax,
        mode,
        sex,
        recruiter,
        skills
    }
}

export const listFilterSerializer = (data, defaultOrdering) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'client': _.get(defaultData, 'client'),
        'position': _.get(defaultData, 'position'),
        'recruiter': _.get(defaultData, 'recruiter'),
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'status': _.get(defaultData, 'status'),
        'is_new': _.get(defaultData, 'isNew'),
        'doing': _.get(defaultData, 'doing'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering ? orderingSnakeCase(ordering) : defaultOrdering
    }
}

export const usersListSerializer = () => {
    return {
        'user_group': '',
        'page_size': 100
    }
}

