import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const brand = _.get(data, ['brand', 'value'])
    const address = _.get(data, ['address'])
    const guide = _.get(data, ['guide'])
    const phone = _.get(data, ['phone'])
    const lat = _.get(data, ['latLng', 'lat'])
    const lng = _.get(data, ['latLng', 'lng'])
    const official = _.get(data, ['official'])
    const contactName = _.get(data, ['contactName'])

    return {
        name,
        brand,
        address,
        guide,
        phone,
        lat,
        lon: lng,
        official,
        'contact_name': contactName
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
