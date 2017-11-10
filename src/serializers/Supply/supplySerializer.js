import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import moment from 'moment'

const ZERO = 0
export const createSerializer = (data) => {
    const provider = _.get(data, ['provider', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])
    const contact = _.get(data, ['contact'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const contract = _.get(data, ['contract'])
    const products = _.map(_.get(data, ['products']), (item) => {
        const amount = numberWithoutSpaces(_.get(item, 'amount'))
        const itemCost = numberWithoutSpaces(_.get(item, 'cost'))
        const summary = numberWithoutSpaces(_.toNumber(amount) * _.toNumber(itemCost))
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
        contract,
        comment,
        'payment_type': paymentType,
        'date_delivery': moment(_.get(data, ['date_delivery'])).format('YYYY-MM-DD'),
        currency,
        products
    }
}

export const updateSerializer = (data, id) => {
    const provider = _.get(data, ['provider', 'value'])
    const stock = _.get(data, ['stock', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])
    const contact = _.get(data, ['contact'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const products = _.map(_.get(data, ['products']), (item) => {
        const spId = _.get(item, 'id')
        const amount = numberWithoutSpaces(_.get(item, 'amount'))
        const itemCost = numberWithoutSpaces(_.get(item, 'cost'))
        const summary = numberWithoutSpaces(_.toNumber(amount) * _.toNumber(itemCost))
        const product = _.get(item, ['product', 'value', 'id'])
        return {
            id: spId,
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
        products,
        'payment_type': paymentType
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'provider': _.get(defaultData, 'provider'),
        'payment_type': _.get(defaultData, 'paymentType'),
        'product': _.get(defaultData, 'product'),
        'stock': _.get(defaultData, 'stock'),
        'status': _.get(defaultData, 'status') === 'pending' ? ZERO : _.get(defaultData, 'status'),
        'contract': _.get(defaultData, 'contract'),
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

