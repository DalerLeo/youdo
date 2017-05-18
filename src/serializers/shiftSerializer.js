import _ from 'lodash'
import moment from 'moment'

export const createSerializer = (data) => {
    console.log(data)
    const name = _.get(data, ['name'])
    const beginTime = _.get(data, ['beginTime'])
    const endTime = _.get(data, ['endTime'])

    return {
        name,
        'begin_time': moment(beginTime).format('HH:mm:ss'),
        'end_time': moment(endTime).format('HH:mm:ss')
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
