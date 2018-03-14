import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

export const createSerializer = (data) => {
    const ageMin = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'min'])))
    const ageMax = _.toNumber(numberWithoutSpaces(_.get(data, ['age', 'max'])))
    const businessTrip = _.get(data, ['businessTrip'])
    const education = _.get(data, ['education', 'name'])
    const responsibility = _.get(data, ['responsibilities'])
    const planningDate = moment(_.get(data, ['plannedEmploymentDate'])).format('YYYY-MM-DD')
    const trialSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'min'])))
    const trialSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['trialSalary', 'max'])))
    const realSalaryMin = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'min'])))
    const realSalaryMax = _.toNumber(numberWithoutSpaces(_.get(data, ['realSalary', 'max'])))
    const client = _.get(data, ['client', 'value'])
    const privileges = [1, 2]
    const skills = _.split(_.get(data, 'skills'), ', ')
    return {
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

