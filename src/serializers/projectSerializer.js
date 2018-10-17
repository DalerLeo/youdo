import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import toSnakeCase from '../helpers/toSnakeCase'
export const createSerializer = (data) => {
  const title = _.get(data, 'title')
  const leader = _.get(data, 'leader')
  const workers = _.get(data, 'workers')
  const isGlobal = _.get(data, 'isGlobal')
  const description = _.get(data, 'description')

  return toSnakeCase({
    title,
    description,
    leader,
    workers,
    isGlobal
  })
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'begin_date': _.get(defaultData, 'fromDate'),
    'end_date': _.get(defaultData, 'toDate'),
    'workers': _.get(defaultData, 'workers'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

