import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}

export const detailFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}

export const transactionSerializer = (data, dataTransaction, id) => {
    const {...defaultData} = data
    const {...defaultDataTransaction} = dataTransaction

    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultDataTransaction, 'dPageSize'),
        'begin_date': _.get(defaultDataTransaction, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'expense_category': id
    }
}

