import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ONE = 1
const TWO = 2
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
    const requestDeadline = moment(_.get(data, ['request_dedline'])).format('YYYY-MM-DD')
    const dealType = _.get(data, ['dealType', 'value'])
    const market = _.get(data, ['market', 'value'])
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
        'request_dedline': requestDeadline,
        'delivery_type': deliveryType,
        'delivery_price': deliveryPrice,
        'discount_price': discountPrice,
        'payment_date': paymentDate,
        'payment_type': paymentType,
        'payment_term': paymentTerm,
        'deal_type': dealType,
        market,
        products
    }
}

export const listFilterSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const dept = _.toInteger(_.get(defaultData, 'dept'))

    if (id) {
        return {
            'id': id
        }
    }
    return {
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client'),
        'zone': _.get(defaultData, 'zone'),
        'user': _.get(defaultData, 'initiator'),
        'dept': dept === ONE ? true : (dept === TWO ? false : null),
        'shop': _.get(defaultData, 'shop'),
        'dateDelivery': _.get(defaultData, 'dateDelivery'),
        'totalCost': _.get(defaultData, 'totalCost'),
        'totalBalance': _.get(defaultData, 'totalBalance'),
        'status': _.get(defaultData, 'orderStatus'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

