import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

export const createSerializer = (data) => {
    const ageMin = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'min'])))
    const ageMax = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'max'])))
    const businessTrip = _.get(data, ['businessTrip'])
    const client = _.get(data, ['client', 'value'])
    const contact = _.toNumber(_.get(data, ['contact']))
    const education = _.get(data, ['education', 'value'])
    const experience = _.toNumber(_.get(data, ['experience']))
    const responsibility = _.get(data, ['responsibilities'])
    const planningDate = moment(_.get(data, ['plannedEmploymentDate'])).format('YYYY-MM-DD')
    const deadline = moment().format('YYYY-MM-DD HH:mm')
    const trialSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'min'])))
    const trialSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'max'])))
    const realSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'min'])))
    const realSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'max'])))
    const compLevel = _.get(data, ['computerLevel', 'value'])
    const languages = _.map(_.get(data, 'languages'), (item) => {
        return {
            language: _.get(item, ['name', 'value']),
            level: _.get(item, ['level', 'value'])
        }
    })
    const sex = _.get(data, ['sex', 'value'])
    const recruiter = _.get(data, ['recruiter', 'id'])
    const mode = _.get(data, ['schedule', 'value'])
    const privileges = _.get(data, 'privileges')
        .map((item, index) => _.get(item, 'selected') ? index : null)
        .filter((item) => item !== null)
    const skills = _.split(_.get(data, 'skills'), ', ')
    return {
        age_min: ageMin,
        age_max: ageMax,
        business_trip: businessTrip,
        client,
        contact,
        education,
        experience,
        deadline,
        languages_level: languages,
        level_pc: compLevel,
        responsibility,
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

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const usersListSerializer = () => {
    return {
        'user_group': '',
        'page_size': 100
    }
}

