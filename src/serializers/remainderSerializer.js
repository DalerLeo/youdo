import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

export const listFilterSerializer = (data, remaider) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'type': _.get(defaultData, 'type'),
        'stock': _.get(defaultData, 'stock'),
        'status': _.get(defaultData, 'status'),
        'search': _.get(defaultData, 'product')
    }
}

export const transferSerializer = (data) => {
    const stock = _.get(data, ['stock', 'value'])
    const comment = _.get(data, ['comment'])
    const deliveryDate = moment(_.get(data, 'deliveryDate')).format('YYYY-MM-DD')
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount,
            product: item.product.value.id
        }
    })

    return {
        'to_stock': stock,
        'date_delivery': deliveryDate,
        products,
        comment
    }
}

