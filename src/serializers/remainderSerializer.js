import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const listFilterSerializer = (data, remaider) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'type': _.get(defaultData, 'type'),
        'stock': _.get(defaultData, 'stock'),
        'status': _.get(defaultData, 'status'),
        'product': _.get(defaultData, 'product')
    }
}

