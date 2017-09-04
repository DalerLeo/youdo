import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const beginTime = _.get(data, ['beginTime'])
    const endTime = _.get(data, ['endTime'])

    return {
        name,
        'begin_time': moment(beginTime).format('HH:mm:ss'),
        'end_time': moment(endTime).format('HH:mm:ss')
    }
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'manufacture': manufacture,
        'name': _.get(defaultData, 'name'),
        'begin_time': _.get(defaultData, 'begin_time'),
        'end_time': _.get(defaultData, 'end_time'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const shiftManufactureSerializer = (manufactureId) => {
    return {
        'manufacture': manufactureId
    }
}

