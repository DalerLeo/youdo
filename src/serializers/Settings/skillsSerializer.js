import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
  const username = _.get(data, 'username')
  const firstName = _.get(data, 'firstName')
  const lastName = _.get(data, 'lastName')
  const password = _.get(data, 'password')
  const isActive = _.get(data, 'isActive')
  const isStaff = _.get(data, 'isStaff')

  return {
    username,
    password,
    'first_name': firstName,
    'last_name': lastName,
    'is_active': isActive,
    'is_staff': isStaff
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')
  return {
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

