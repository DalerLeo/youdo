import _ from 'lodash'

export const createSerializer = (data, detail) => {
    const provider = _.get(detail, ['provider', 'id'])
    const products = _.map(_.get(detail, 'products'), (item) => {
        const amount = _.get(item, 'amount')
        const supplyProduct = _.get(item, ['product', 'id'])
        const defectAmount = _.get(item, 'defectAmount')

        return {
            'supply_product': supplyProduct,
            amount,
            'defect_amount': defectAmount
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
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search')
    }
}

