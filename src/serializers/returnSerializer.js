import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ZERO = 0
const TWO = 2
export const updateSerializer = (data, detail, CLIENT_RETURN) => {
    const type = _.toInteger(_.get(detail, 'type'))
    const client = _.get(detail, ['client', 'id'])
    const comment = _.get(data, 'comment')
    const stock = _.get(data, ['stock', 'value'])
    const market = _.get(data, ['market', 'value', 'id'])
    const status = _.get(detail, 'status')
    const order = _.get(detail, 'order')
    const paymentType = _.get(data, ['paymentType', 'value'])
    const returnedProducts = _.map(_.get(data, ['products']), (item) => {
        return {
            order_product: _.get(item, ['product', 'value', 'id']),
            amount: _.get(item, 'amount'),
            cost: _.get(item, 'cost'),
            comment: _.get(item, 'comment'),
            product: _.get(item, ['product', 'value']),
            name: _.get(item, ['product', 'value', 'name'])
        }
    })
    const clientReturnedProducts = _.map(_.get(data, ['products']), (item) => {
        return {
            amount: _.get(item, 'amount'),
            cost: _.get(item, 'cost'),
            product: _.get(item, ['product', 'value', 'productId'])
        }
    })
    if (type === CLIENT_RETURN) {
        return {
            client,
            stock,
            comment,
            products: clientReturnedProducts,
            market,
            payment_type: paymentType === TWO ? ZERO : paymentType
        }
    }
    return {
        order,
        comment,
        returned_products: returnedProducts,
        stock,
        market,
        status
    }
}

export const listFilterSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    if (id) {
        return {
            'id': id
        }
    }
    return {
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client'),
        'type': _.get(defaultData, 'type'),
        'code': _.get(defaultData, 'code'),
        'product': _.get(defaultData, 'product'),
        'division': _.get(defaultData, 'division'),
        'market': _.get(defaultData, 'market'),
        'order': _.get(defaultData, 'order'),
        'created_by': _.get(defaultData, 'initiator'),
        'payment_type': _.get(defaultData, 'paymentType'),
        'status': _.get(defaultData, 'status'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const createReturnSerializer = (data, id) => {
    const client = _.get(data, ['client', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const market = _.get(data, ['market', 'value', 'id'])
    const comment = _.get(data, ['comment'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const products = _.map(_.get(data, ['products']), (item) => {
        const amount = numberWithoutSpaces(_.get(item, 'amount'))
        const cost = numberWithoutSpaces(_.get(item, 'cost'))
        const product = _.get(item, ['product', 'value', 'id'])
        return {
            amount,
            cost,
            product
        }
    })

    return {
        client,
        stock,
        comment,
        products,
        market,
        payment_type: paymentType === TWO ? ZERO : paymentType
    }
}

