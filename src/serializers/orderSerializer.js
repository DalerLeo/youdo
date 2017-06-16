import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const contact = _.get(data, ['contact'])
    const paymentType = 1
    const paymentTerm = 1
    const paymentDate = moment(_.get(data, ['paymentDate'])).format('YYYY-MM-DD')
    const deliveryDate = moment(_.get(data, ['deliveryDate'])).format('YYYY-MM-DD')
    const deliveryType = _.get(data, ['deliveryType', 'value'])
    const deliveryPrice = numberWithoutSpaces(_.get(data, 'deliveryPrice'))
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
        'date_delivery': deliveryDate,
        'request_dedline': deliveryDate,
        'delivery_type': deliveryType,
        'delivery_price': deliveryPrice,
        'discount_price': discountPrice,
        'payment_date': paymentDate,
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
