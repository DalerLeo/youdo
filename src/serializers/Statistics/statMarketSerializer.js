import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'user': _.get(defaultData, 'user'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}

export const sumFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'user': _.get(defaultData, 'user'),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}
