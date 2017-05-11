import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const contact = 2
    const paymentType = 1
    const paymentTerm = 1
    const deliveryType = _.get(data, ['deliveryType', 'value'])
    const deliveryPrice = _.get(data, 'deliveryPrice')
    const discountPrice = _.get(data, 'discountPrice')
    const market = 1
    const totalPrice = 12345
    const products = _.map(_.get(data, ['products']), (item) => {
        return {
            amount: item.amount,
            cost: item.cost,
            product: item.product.value
        }
    })
    return {
        client,
        contact,
        'delivery_type': deliveryType,
        'delivery_price': deliveryPrice,
        'discount_price': discountPrice,
        'payment_type': paymentType,
        'payment_term': paymentTerm,
        'total_price': totalPrice,
        market,
        products
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
        'status': _.get(defaultData, 'status'),
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
