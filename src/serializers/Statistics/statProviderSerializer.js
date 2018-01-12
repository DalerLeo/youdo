import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

const ZERO = 0
export const listFilterSerializer = (query) => {
    const {...defaultData} = query
    const ordering = _.get(query, 'ordering')

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

    return {
        'begin_date': firstDayOfMonth,
        'end_date': lastDayOfMonth,
        'search': _.get(defaultData, 'search'),
        'zone': _.get(defaultData, 'zone') || null,
        'division': _.get(defaultData, 'division') || null,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const summaryFilterSerializer = (query) => {
    const {...defaultData} = query
    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

    return {
        'begin_date': firstDayOfMonth,
        'end_date': lastDayOfMonth,
        'zone': _.get(defaultData, 'zone') || null,
        'division': _.get(defaultData, 'division') || null
    }
}

export const itemFilterSerializer = (data, id, division, currency, type) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const paymentType = type || null
    const request = {
        'provider': id,
        'payment_type': paymentType,
        'currency': currency,
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
    if (division > ZERO) {
        return _.merge(request, {division})
    }
    return request
}

