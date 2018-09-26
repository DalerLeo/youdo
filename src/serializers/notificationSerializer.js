import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data, detail) => {
  const name = _.get(data, ['name'])
  const status = _.get(detail, 'status')
  const keywords = _.get(detail, 'keywords')
  const title = _.get(detail, 'title')
  const text = _.get(detail, 'text')

  return {
    name,
    status,
    keywords,
    title,
    text
  }
}
export const changeSerializer = (detail) => {
  const name = _.get(detail, 'name')
  const status = _.get(detail, 'status') === 'on' ? 'off' : 'on'
  const keywords = _.get(detail, 'keywords')
  const title = _.get(detail, 'title')
  const text = _.get(detail, 'text')
  return {
    name,
    status,
    keywords,
    title,
    text
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'name': _.get(defaultData, 'name'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

export const userSerializer = (data) => {
  const agent = _.get(data, ['user', 'value'])

  return {
    'user': agent
  }
}
