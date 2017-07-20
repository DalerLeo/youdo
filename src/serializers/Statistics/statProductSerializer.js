import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'type': _.get(defaultData, 'productType'),
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate')
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData
    }
}
