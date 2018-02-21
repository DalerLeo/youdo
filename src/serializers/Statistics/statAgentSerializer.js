import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (query) => {
    const {...defaultData} = query
    const ordering = _.get(query, 'ordering')

    return {
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
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

    return {
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'zone': _.get(defaultData, 'zone') || null,
        'division': _.get(defaultData, 'division') || null
    }
}

export const itemSerializer = (data, filterItem, id) => {
    const {...defaultData} = data
    const begin = _.get(defaultData, 'fromDate') || firstDayOfMonth
    const end = _.get(defaultData, 'toDate') || lastDayOfMonth

    return {
        'user': id,
        'exclude_cancelled': 'True',
        'page': _.get(filterItem, 'dPage'),
        'page_size': _.get(filterItem, 'dPageSize'),
        'division': _.get(filterItem, 'division'),
        'begin_date': begin,
        'end_date': end
    }
}

