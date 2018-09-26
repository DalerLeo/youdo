import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const courseSerializer = (data, currency) => {
  const rate = _.get(data, 'rate')

  return {
    rate,
    currency
  }
}

export const createSerializer = (data) => {
  const name = _.get(data, 'name')
  const groups = _.map(_.get(data, 'perms'), (item, index) => {
    return item ? index : null
  })
  const filteredArr = _.filter(groups, (item) => {
    return item
  })
  return {
    name,
    'permissions': filteredArr
  }
}

export const itemSerializer = (data, id) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')
  return {
    'currency': id,
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'name': _.get(defaultData, 'name'),
    'page': 1,
    'page_size': 300,
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

