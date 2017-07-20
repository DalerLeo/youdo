import _ from 'lodash'
const ONE = 1
const ZERO = 0
const TWO = 2

export const acceptSerializer = (id, stock) => {
    return {
        'order': id,
        'comment': 'fdasfasdfa',
        stock
    }
}

export const createSerializer = (data, detail) => {
    const provider = _.get(detail, ['provider', 'id'])
    const products = _.map(_.get(detail, 'products'), (item, index) => {
        const supplyProduct = _.get(item, 'id')

        return {
            'amount': _.get(data, ['product', index, 'accepted']),
            'defect_amount': _.get(data, ['product', index, 'defected']),
            'supply_product': supplyProduct
        }
    })

    const stock = _.get(detail, ['stock', 'id'])
    const dateDelivery = _.get(detail, 'dateDelivery')
    const contact = _.get(detail, ['contact', 'id'])
    const currency = _.get(detail, ['currency', 'id'])

    return {
        provider,
        products,
        stock,
        'date_delivery': dateDelivery,
        contact,
        currency
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const type = (_.toInteger(_.get(defaultData, 'type')) === _.toInteger(ONE)) ? ZERO
                    : (_.toInteger(_.get(defaultData, 'type')) === _.toInteger(TWO)) ? ONE
                        : null
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search'),
        'type': type,
        'product': _.get(defaultData, 'product'),
        'brand': _.get(defaultData, 'brand'),
        'from_date': _.get(defaultData, 'fromDate'),
        'to_date': _.get(defaultData, 'toDate'),
        'product_type': _.get(defaultData, 'productType')

    }
}

