import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'division': _.get(defaultData, 'division'),
        'payment_type': _.get(defaultData, 'paymentType'),
        'market_type': _.get(defaultData, 'marketTypeChild') || _.get(defaultData, 'marketType'),
        'currency': _.get(defaultData, 'currency'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const itemSerializer = (id, data) => {
    const {...defaultData} = data
    return {
        page: _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'client': id,
        'dept': true
    }
}

