import _ from 'lodash'

export const createSerializer = (data, detail) => {
    const order = _.get(detail, 'id')
    const comment = _.get(data, 'comment')
    const dealType = _.get(data, 'dealType')
    const stock = _.get(data, ['stock', 'value'])
    const returnedProducts = _.map(_.get(data, ['products']), (item) => {
        return {
            order_product: item.product.value.id,
            amount: item.amount
        }
    })
    return {
        order,
        comment,
        'dealType': dealType,
        'returned_products': returnedProducts,
        stock
    }
}
