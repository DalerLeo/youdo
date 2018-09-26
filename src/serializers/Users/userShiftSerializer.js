import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data, manufacture) => {
  const user = _.get(data, ['user', 'value'])
  const shift = _.get(data, ['shift', 'value'])
  return {
    user,
    shift,
    manufacture
  }
}

export const listFilterSerializer = (data, manufacture) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering')

  return {
    manufacture,
    'name': _.get(defaultData, 'name'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'shift': _.get(defaultData, 'shift'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}
export const shiftManufactureSerializer = (manufactureId) => {
  return {
    'manufacture': manufactureId
  }
}

