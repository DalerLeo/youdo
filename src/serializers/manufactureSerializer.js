import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const category = _.get(data, ['category', 'value'])
    const address = _.get(data, ['address'])
    const guide = _.get(data, ['guide'])
    const phone = _.get(data, ['phone'])
    const lat = _.get(data, ['latLng', 'lat'])
    const lng = _.get(data, ['latLng', 'lng'])
    const official = _.get(data, ['official'])
    const contactName = _.get(data, ['contactName'])

    return {
        name,
        category,
        address,
        guide,
        phone,
        lat,
        lon: lng,
        official,
        'contact_name': contactName
    }
}

export const shiftCreateSerializer = (data) => {
    const name = _.get(data, ['name'])
    const beginTime = _.get(data, ['beginTime'])
    const endTime = _.get(data, ['endTime'])

    return {
        name,
        'begin_time': moment(beginTime).format('HH:mm:ss'),
        'end_time': moment(endTime).format('HH:mm:ss')
    }
}

export const shiftListFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'name': _.get(defaultData, 'name'),
        'begin_time': _.get(defaultData, 'begin_time'),
        'end_time': _.get(defaultData, 'end_time')
    }
}
export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'brand': _.get(defaultData, 'brand'),
        'type': _.get(defaultData, 'type'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
