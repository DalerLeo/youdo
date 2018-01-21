import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'expanse_category': _.get(defaultData, 'categoryExpense')
    }
}

export const itemSerializer = (data, filterItem, id) => {
    const {...defaultData} = data

    return {
        'user': id,
        'page': _.get(filterItem, 'page'),
        'page_size': _.get(filterItem, 'pageSize'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate')
    }
}
export const transactionSerializer = (data, transactionData, staff) => {
    const {...defaultData} = data
    const {...defaultTransactionData} = transactionData

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

    return {
        'page': _.get(defaultTransactionData, 'dPage'),
        'page_size': _.get(defaultTransactionData, 'dPageSize'),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'staff': staff
    }
}

