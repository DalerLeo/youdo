import _ from 'lodash'

export const createSerializer = (data, detail) => {
    const order = _.get(detail, 'id')
    const comment = _.get(data, 'comment')
    const dealType = _.get(data, 'dealType')
    const returnedProducts = _.map(_.get(data, ['returned_products']), (item) => {
        return {
            order_product: item.product.value.id,
            amount: item.amount,
            cost: item.cost,
            comment: item.comment,
            product: item.product.value,
            name: item.product.value.product.name
        }
    })
    return {
        order,
        comment,
        'dealType': dealType,
        'returned_products': returnedProducts
    }
}
