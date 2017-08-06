import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import moment from 'moment'

export const createSerializer = (data) => {
    const provider = _.get(data, ['provider', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])
    const contact = _.get(data, ['contact'])
    const products = _.map(_.get(data, ['products']), (item) => {
        const amount = _.get(item, 'amount')
        const itemCost = _.get(item, 'cost')
        const summary = _.toNumber(amount) * _.toNumber(itemCost)
        const product = _.get(item, ['product', 'value', 'id'])
        return {
            amount: amount,
            cost: summary,
            product: product
        }
    })

    return {
        provider,
        stock,
        contact,
        comment,
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
        'date_delivery_0': _.get(defaultData, 'deliveryFromDate'),
        'date_delivery_1': _.get(defaultData, 'deliveryToDate'),
        'created_date_0': _.get(defaultData, 'createdFromDate'),
        'created_date_1': _.get(defaultData, 'createdToDate'),
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
