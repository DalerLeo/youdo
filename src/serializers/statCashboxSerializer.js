import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    return {
        'cashbox': id,
        'name': _.get(defaultData, 'name'),
        'division': _.get(defaultData, 'division'),
        'search': _.get(defaultData, 'search'),
        'type': _.get(defaultData, 'type'),
        'page': _.get(defaultData, 'page'),
        'expense_category': _.get(data, 'categoryExpense'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'client': _.get(defaultData, 'client'),
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}

