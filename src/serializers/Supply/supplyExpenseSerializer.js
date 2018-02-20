import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

export const createSerializer = (data, id) => {
    const supply = id

    const amount = numberWithoutSpaces(_.get(data, ['amount']))
    const currency = _.get(data, ['currency', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const comment = _.get(data, 'comment')
    const supplyProduct = _.get(data, ['product', 'value', 'id'])

    return {
        supply,
        amount,
        currency,
        comment,
        'bind_to_provider': _.get(data, 'bindToProvider') || false,
        'payment_type': paymentType,
        'supply_product': supplyProduct
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'provider': _.get(defaultData, 'provider'),
        'stock': _.get(defaultData, 'stock'),
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const expenseSupplySerializer = (supplyId, data) => {
    const {...defaultData} = data
    return {
        'supply': supplyId,
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize')
    }
}

export const supplyPaidSerializer = (supplyId) => {
    return {
        'supply': supplyId
    }
}

