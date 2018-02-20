import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'
import toBoolean from '../helpers/toBoolean'

export const updateSerializer = (data, detail, CLIENT_RETURN) => {
    const type = _.toInteger(_.get(detail, 'type'))
    const client = _.get(detail, ['client', 'id'])
    const comment = _.get(data, 'comment')
    const currency = _.get(data, ['currency', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const market = _.get(data, ['market', 'value'])
    const status = _.get(detail, 'status')
    const order = _.get(detail, 'order')
    const paymentType = _.get(data, ['paymentType', 'value'])
    const priceList = _.get(data, ['priceList', 'value'])
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
            id: _.get(item, 'id'),
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
            currency,
            products: clientReturnedProducts,
            market,
            payment_type: paymentType,
            price_list: priceList
        }
    }
    return {
        order,
        comment,
        currency,
        returned_products: returnedProducts,
        price_list: priceList,
        stock,
        market,
        status
    }
}

export const listFilterSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const excludeCanceled = toBoolean(_.get(defaultData, 'exclude')) ? null : 'True'

    if (id) {
        return {
            'id': id
        }
    }
    return {
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client') || null,
        'type': _.get(defaultData, 'type'),
        'code': _.get(defaultData, 'code'),
        'product': _.get(defaultData, 'product') || null,
        'division': _.get(defaultData, 'division') || null,
        'market': _.get(defaultData, 'market') || null,
        'order': _.get(defaultData, 'order'),
        'created_by': _.get(defaultData, 'initiator') || null,
        'payment_type': _.get(defaultData, 'paymentType'),
        'status': _.get(defaultData, 'status') || null,
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'exclude_cancelled': excludeCanceled,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const createReturnSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const market = _.get(data, ['market', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const priceList = _.get(data, ['priceList', 'value'])
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
        'price_list': priceList || '1',
        client,
        stock,
        comment,
        currency,
        products,
        market,
        payment_type: paymentType
    }
}

