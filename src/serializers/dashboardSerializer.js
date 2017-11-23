import _ from 'lodash'
import moment from 'moment'

export const orderChart = (data) => {
    const {...defaultData} = data
    const lastDayOfMonth = _.get(defaultData, 'endDate')
        ? moment(_.get(defaultData, 'endDate')).daysInMonth()
        : moment().daysInMonth()
    const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
    const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

    return {
        'exclude_cancelled': 'True',
        'begin_date': urlFromDate,
        'end_date': urlToDate
    }
}

export const agentsChart = (data) => {
    const {...defaultData} = data
    const beginMonth = _.get(defaultData, 'beginDate') ? moment(_.get(defaultData, 'beginDate')).format('M') : moment().format('M')
    const endMonth = _.get(defaultData, 'endDate') ? moment(_.get(defaultData, 'endDate')).format('M') : moment().format('M')
    const beginYear = _.get(defaultData, 'beginDate') ? moment(_.get(defaultData, 'beginDate')).format('YYYY') : moment().format('YYYY')
    const endYear = _.get(defaultData, 'endDate') ? moment(_.get(defaultData, 'endDate')).format('YYYY') : moment().format('YYYY')

    return {
        'page_size': '100',
        'begin_month': beginMonth,
        'end_month': endMonth,
        'begin_year': beginYear,
        'end_year': endYear
    }
}

export const incomeFinance = (data) => {
    const {...defaultData} = data
    const lastDayOfMonth = _.get(defaultData, 'endDate')
        ? moment(_.get(defaultData, 'endDate')).daysInMonth()
        : moment().daysInMonth()
    const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
    const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

    return {
        amount_type: 'income',
        'begin_date': urlFromDate,
        'end_date': urlToDate
    }
}

export const expenseFinance = (data) => {
    const {...defaultData} = data
    const lastDayOfMonth = _.get(defaultData, 'endDate')
        ? moment(_.get(defaultData, 'endDate')).daysInMonth()
        : moment().daysInMonth()
    const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
    const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

    return {
        amount_type: 'expense',
        'begin_date': urlFromDate,
        'end_date': urlToDate
    }
}

