import _ from 'lodash'
import moment from 'moment'

export const createSerializer = (data, manufacture) => {
    const user = _.get(data, ['user', 'value'])
    const shift = _.get(data, ['shift', 'value'])

    return {
        user,
        shift,
        manufacture
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'name': _.get(defaultData, 'name'),
        'begin_time': _.get(defaultData, 'begin_time'),
        'end_time': _.get(defaultData, 'end_time')
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
