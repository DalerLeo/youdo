import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
  const name = _.get(data, ['name'])
  const description = _.get(data, ['description'])
  const activityField = _.get(data, ['activityField', 'value'])
  const hrAgency = _.get(data, ['hrAgency'])
  const users = _.map(_.get(data, 'users'), item => _.get(item, ['user', 'value']))

  return {
    kind: 'ooo',
    name,
    user: users,
    description,
    hr_agency: hrAgency,
    activity_field: activityField
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

