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
        'begin_time': _.get(defaultData, 'begin_time'),
        'end_time': _.get(defaultData, 'end_time'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const shiftManufactureSerializer = (manufactureId) => {
    return {
        'manufacture': manufactureId
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}