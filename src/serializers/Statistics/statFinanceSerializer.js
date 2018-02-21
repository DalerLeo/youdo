import _ from 'lodash'
import moment from 'moment'

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const expense = (data) => {
    const {...defaultData} = data
    const type = _.get(defaultData, 'type')

    return {
        amount_type: 'expense',
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'type': type,
        'client': _.get(defaultData, 'client'),
        'expense_category': _.get(data, 'categoryExpense'),
        'income_category': _.get(data, 'categoryIncome') || null

    }
}

export const income = (data) => {
    const {...defaultData} = data
    const type = _.get(defaultData, 'type')

    return {
        amount_type: 'income',
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'type': type,
        'client': _.get(defaultData, 'client'),
        'expense_category': _.get(data, 'categoryExpense'),
        'income_category': _.get(data, 'categoryIncome') || null

    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const type = _.get(defaultData, 'type')
    return {
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'type': type,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'client': _.get(defaultData, 'client'),
        'page_size': _.get(defaultData, 'pageSize'),
        'expense_category': _.get(data, 'categoryExpense') || null,
        'income_category': _.get(data, 'categoryIncome') || null
    }
}
