import _ from 'lodash'
import moment from 'moment'

export const orderChart = (data) => {
  const {...defaultData} = data
  const lastDayOfMonth = moment().daysInMonth()
  const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
  const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

  return {
    'exclude_cancelled': 'True',
    'begin_date': urlFromDate,
    'end_date': urlToDate
  }
}

export const returnChart = (data) => {
  const {...defaultData} = data
  const lastDayOfMonth = moment().daysInMonth()
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
  const lastDayOfMonth = moment().daysInMonth()
  const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
  const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

  return {
    'page_size': '100',
    'begin_date': urlFromDate,
    'end_date': urlToDate
  }
}

export const incomeFinance = (data) => {
  const {...defaultData} = data
  const lastDayOfMonth = moment().daysInMonth()
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
  const lastDayOfMonth = moment().daysInMonth()
  const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-01')
  const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-' + lastDayOfMonth)

  return {
    amount_type: 'expense',
    'begin_date': urlFromDate,
    'end_date': urlToDate
  }
}

export const passwordSerializer = (data) => {
  const {...defaultData} = data
  return {
    'current_password': _.get(defaultData, 'currentPassword'),
    'new_password': _.get(defaultData, 'newPassword')
  }
}

