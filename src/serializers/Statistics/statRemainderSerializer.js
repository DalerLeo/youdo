import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
const ONE = 1
export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'page': _.get(defaultData, 'page'),
        'division': _.get(defaultData, 'division'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'type': _.get(defaultData, 'type'),
        'product': _.get(defaultData, 'product'),
        'stock': _.get(defaultData, 'stock'),
        'with_price': ONE
    }
}

export const itemFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize')
    }
}
