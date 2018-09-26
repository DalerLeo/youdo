import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
  const name = _.get(data, 'name')
  const sphere = _.get(data, 'sphere')
  const inBlacklist = _.get(data, 'inBlacklist')
  const fromWhom = _.get(data, ['from', 'value'])
  const address = _.get(data, 'address')
  const contacts = _(data)
    .get('contacts')
    .filter((item) => {
      return !_.isEmpty(item)
    })
  return {
    name,
    sphere,
    address,
    contacts,
    'from_whom': fromWhom,
    'in_blacklist': inBlacklist || false

  }
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

