import _ from 'lodash'
import moment from 'moment'
const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const urlFromDate = _.get(defaultData, 'fromDate')
  const urlToDate = _.get(defaultData, 'toDate')

  return {
    'from_date': urlFromDate || firstDayOfMonth,
    'to_date': urlToDate || lastDayOfMonth,

    'manufacture': _.get(defaultData, 'manufacture'),
    'user_group': _.get(defaultData, 'group'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize')
  }
}

