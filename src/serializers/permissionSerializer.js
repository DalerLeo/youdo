import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import {
  ON_TIME,
  OFF_TIME
} from '../constants/permissionTime'

export const updateSerializer = (id, status) => {
  const statusChange = status === true ? '2' : '1'
  return {
    id,
    'status': statusChange
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    'name': _.get(defaultData, 'name'),
    'type': _.get(defaultData, 'type'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}
export const setDateSerializer = (data) => {
  const status = _.get(data, ['status', 'value'])
  const fromTime = _.get(data, 'fromTime')
  const toTime = _.get(data, 'toTime')
  const fromTimeRequest = _.isString(fromTime) ? fromTime + ':00' : moment(fromTime).format('HH:mm:ss')
  const toTimeRequest = _.isString(toTime) ? toTime + ':00' : moment(toTime).format('HH:mm:ss')
  const withTime = status === ON_TIME || status === OFF_TIME
  return {
    'from_time': withTime ? fromTimeRequest : null,
    'to_time': withTime ? toTimeRequest : null,
    status
  }
}

