import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const updateSerializer = (data) => {
    const comment = _.get(data, 'comment')
    const stock = _.get(data, ['stock', 'value'])
    const market = _.get(data, ['market', 'value'])
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
    return {
        comment,
        'returned_products': returnedProducts,
        stock,
        market
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
        'status': _.get(defaultData, 'status'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

