import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

export const createSerializer = (data) => {
    const product = _.get(data, ['product', 'value'])
    const ingridients = _.map(_.get(data, ['ingridients']), (item) => {
        return {
            amount: item.amount,
            ingridient: item.ingridient.value
        }
    })

    return {
        'product_id': product,
        ingridients
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'provider': _.get(defaultData, 'provider'),
        'stock': _.get(defaultData, 'stock'),
        'date_delivery_0': _.get(defaultData, 'fromDate'),
        'date_delivery_1': _.get(defaultData, 'toDate'),
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
