import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data, manufactureId) => {
    const product = _.get(data, ['product', 'value'])
    const manufacture = manufactureId
    const ingredients = _.map(_.get(data, ['ingredients']), (item) => {
        return {
            amount: item.amount,
            ingredient: item.ingredient.value
        }
    })

    return {
        manufacture,
        product,
        ingredients
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
export const changeManufacture = (data) => {
    const manufacture = _.get(data, ['manufacture', 'value'])

    return {
        'manufacture': manufacture
    }
}
