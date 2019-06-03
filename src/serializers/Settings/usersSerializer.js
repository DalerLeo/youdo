import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
  const username = _.get(data, 'username')
  const password = _.get(data, 'password')
  const groups = _.get(data, 'groups')
  return {
    username,
    password,
    groups
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering') || '-id'
  return {
    'manufacture': _.get(defaultData, 'manufacture'),
    'user_group': _.get(defaultData, 'group'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

