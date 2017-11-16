import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'
const ZERO = 0
const ONE = 1
export const listFilterSerializer = (data) => {
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        date,
        'page_size': 50,
        'search': _.get(defaultData, 'search'),
        'group': _.get(defaultData, 'group'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const monthlyPlanSerializer = (data, query, user) => {
    const year = moment(_.get(query, 'date')).format('YYYY') || moment().format('YYYY')
    const month = moment(_.get(query, 'date')).format('M') || moment().format('M')
    const filtered = _.filter(_.get(data, 'divisions'), (item, index) => {
        return index > ZERO
    })
    return _.map(filtered, (item, index) => {
        const amount = _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        return {
            user,
            division: index + ONE,
            amount,
            year,
            month
        }
    })
}

export const monthlyPlanItemSerializer = (query, user) => {
    const year = moment(_.get(query, 'date')).format('YYYY') || moment().format('YYYY')
    const month = moment(_.get(query, 'date')).format('M') || moment().format('M')
    return {
        user,
        year,
        month
    }
}

export const agentMonthlyPlanSerializer = (query, user) => {
    const year = moment(_.get(query, 'date')).format('YYYY') || moment().format('YYYY')
    const month = moment(_.get(query, 'date')).format('M') || moment().format('M')

    return {
        user,
        month,
        year
    }
}

export const createSerializer = (data, query, comboChosenAgent) => {
    const type = _.get(data, ['planType']) || 'week'
    const priority = _.get(data, ['priority', 'value'])
    const recurrences = _.map(_.get(data, 'weekday'), (item) => {
        if (type === 'month') {
            return {
                type: type,
                month_day: _.get(item, 'id')
            }
        }
        return {
            type: type,
            week_day: _.get(item, 'id')
        }
    })

    return {
        agent: comboChosenAgent || _.get(query, 'agent'),
        market: _.get(query, 'market'),
        recurrences,
        priority
    }
}

export const comboSerializer = (data, query) => {
    const type = _.get(data, ['planType']) || 'week'
    const priority = _.get(data, ['priority', 'value'])
    const recurrences = _.map(_.get(data, 'weekday'), (item) => {
        if (type === 'month') {
            return {
                type: type,
                month_day: _.get(item, 'id')
            }
        }
        return {
            type: type,
            week_day: _.get(item, 'id')
        }
    })

    return {
        agent: _.get(data, 'agents'),
        market: _.get(query, 'market'),
        recurrences,
        priority
    }
}

