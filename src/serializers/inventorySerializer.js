import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    const ordering = _.get(data, 'ordering')
    return {
        'begin_date': _.get(data, 'fromDate'),
        'end_date': _.get(data, 'toDate'),
        'created_by': _.get(data, 'createdBy'),
        'stock': _.get(data, 'stock'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const inventoryFilterSerializer = (data, productType, page) => {
    const {...defaultData} = data
    return {
        'page': page,
        'page_size': 50,
        'product_type': productType,
        'stock': _.get(defaultData, 'pdStock'),
        'search': _.get(defaultData, 'pdSearch')
    }
}

export const inventoryCreateSerializer = (form, query) => {
    return {
        stock: _.get(query, ['pdStock']),
        inventory_products: _.map(form, (item) => {
            return {
                product: _.get(item, 'id'),
                amount: _.get(item, 'amount'),
                defect_amount: _.get(item, 'defect')
            }
        })
    }
}
