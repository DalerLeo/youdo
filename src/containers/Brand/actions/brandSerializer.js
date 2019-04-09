import _ from 'lodash'
import {orderingSnakeCase} from '../../../helpers/serializer'

export const createSerializer = (data) => {
  const title = _.get(data, ['name'])
  return {
    title
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'name': _.get(defaultData, 'name'),
    'division': _.get(defaultData, 'division'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

