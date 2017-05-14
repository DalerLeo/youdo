import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

export const createSerializer = (data) => {
    console.log(data)
    const provider = _.get(data, ['provider', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])
    const products = _.map(_.get(data, ['products']), (item) => {
        return {
            amount: item.amount,
            cost: item.cost,
            product: item.product.value
        }
    })

    return {
        provider,
        stock,
        'contact': 1,
        'comment': comment,
        'date_delivery': moment(_.get(data, ['date_delivery'])).format('YYYY-MM-DD'),
        currency,
        products
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'provider': _.get(defaultData, 'provider'),
        'stock': _.get(defaultData, 'stock'),
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
