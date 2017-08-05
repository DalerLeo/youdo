import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const ONE = 1
export const createSerializer = (data, location, image) => {
    const name = _.get(data, 'name')
    const client = _.get(data, ['client', 'value'])
    const marketType = _.get(data, ['marketType', 'value'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const frequency = _.get(data, ['frequency', 'value'])
    const phone = _.get(data, 'phone')
    const status = _.get(data, ['status', 'value'])
    const lat = _.get(location, 'lat')
    const lon = _.get(location, 'lng')
    const contactName = _.get(data, ['contactName'])
    let isActive = false
    if (status === ONE) {
        isActive = true
    }

    return {
        name,
        client,
        'market_type': marketType,
        address,
        guide,
        'visit_frequency': frequency,
        phone,
        'contact_name': contactName,
        'location': {
            'lat': lat,
            'lon': lon
        },
        'is_active': isActive
    }
}

export const updateSerializer = (data, location, image) => {
    const name = _.get(data, 'name')
    const client = _.get(data, 'client')
    const marketType = _.get(data, ['marketType', 'value'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const frequency = _.get(data, ['frequency', 'value'])
    const phone = _.get(data, 'phone')
    const status = _.get(data, ['status', 'value'])
    const lat = _.get(location, 'lat')
    const lon = _.get(location, 'lng')
    const contactName = _.get(data, ['contactName'])
    let isActive = false
    if (status === ONE) {
        isActive = true
    }

    return {
        name,
        client,
        'market_type': marketType,
        address,
        guide,
        'visit_frequency': frequency,
        phone,
        'contact_name': contactName,
        'location': {
            'lat': lat,
            'lon': lon
        },
        'is_active': isActive
    }
}

export const imageSerializer = (image) => {
    return {
        'image': image,
        'is_primary': false
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'client': _.get(defaultData, 'client'),
        'created_by': _.get(defaultData, 'createdBy'),
        'is_active': _.get(defaultData, 'isActive'),
        'frequency': _.get(defaultData, 'frequency'),
        'zone': _.get(defaultData, 'zone'),
        'market_type': _.get(defaultData, 'marketType'),
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
