import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const returnedProducts = _.map(_.get(data, ['returned_products']), (item) => {
        return {
            amount: item.amount,
            cost: item.cost,
            product: item.product.value,
            name: item.product.text
        }
    })
    return {
        'returned_products': returnedProducts
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client'),
        'user': _.get(defaultData, 'user'),
        'dateDelivery': _.get(defaultData, 'dateDelivery'),
        'totalCost': _.get(defaultData, 'totalCost'),
        'totalBalance': _.get(defaultData, 'totalBalance'),
        'orderStatus': _.get(defaultData, 'orderStatus'),
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
