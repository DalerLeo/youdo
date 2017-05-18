import _ from 'lodash'
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

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
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
