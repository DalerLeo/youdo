import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const deliveryComp = _.get(data, ['deliveryComp'])
    const delivery = _.get(data, ['delivery'])
    const nameStock = _.get(data, ['nameStock'])
    const toDate = _.get(data, ['toDate'])
    const typePayment = _.get(data, ['typePayment'])
    const additionalDescription = _.get(data, ['additionalDescription'])
    const additionalCost = _.get(data, ['additionalExpensive'])
    const additionalPaymentType = _.get(data, ['additionalPaymentType'])
    const productList = _.get(data, ['productList'])

    return {
        deliveryComp,
        delivery,
        nameStock,
        toDate,
        typePayment,
        additionalDescription,
        additionalCost,
        additionalPaymentType,
        productList
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'category': _.get(defaultData, 'category'),
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
