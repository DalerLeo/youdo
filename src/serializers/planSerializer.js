import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import toSnakeCase from '../helpers/toSnakeCase'
export const createSerializer = (data) => {
  const salesAmount = _.get(data, 'salesAmount')
  const manager = _.get(data, 'manager')
  const comment = _.get(data, 'comment')
  const fromDate = _.get(data, 'period.fromDate') && _.get(data, 'period.fromDate').format('YYYY-MM-DD')
  const toDate = _.get(data, 'period.toDate') && _.get(data, 'period.toDate').format('YYYY-MM-DD')

  return toSnakeCase({
    salesAmount,
    manager,
    fromDate,
    toDate,
    comment
  })
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'begin_date': _.get(defaultData, 'fromDate'),
    'end_date': _.get(defaultData, 'toDate'),
    'manager': _.get(defaultData, 'manager'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

