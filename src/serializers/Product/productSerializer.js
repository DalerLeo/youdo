import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const brand = _.get(data, ['brand', 'value'])
    const type = _.get(data, ['type', 'value']) || _.get(data, ['productTypeParent', 'value'])
    const measurement = _.get(data, ['measurement', 'value'])
    const image = _.get(data, 'image')
    const imageId = (_.get(image, ['id'])) ? _.get(image, ['id']) : image

    return {
        name,
        brand,
        type,
        measurement,
        image: imageId
    }
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'manufacture': manufacture,
        'brand': _.get(defaultData, 'brand'),
        'type': _.get(defaultData, 'type'),
        'measurement': _.get(defaultData, 'measurement'),
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
