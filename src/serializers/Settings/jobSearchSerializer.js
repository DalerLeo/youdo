import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import toSnakeCase from '../../helpers/toSnakeCase'
export const createSerializer = (data) => {
  const name = _.get(data, 'name')
  return toSnakeCase({
    name
  })
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'begin_date': _.get(defaultData, 'fromDate'),
    'end_date': _.get(defaultData, 'toDate'),
    'in_blacklist': _.get(defaultData, 'inBlacklist'),
    'from_whom': _.get(defaultData, 'fromWho'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

