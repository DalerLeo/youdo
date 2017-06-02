import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

const ZERO = 0
export const listFilterSerializer = (data, stock) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const newStock = (stock !== ZERO) ? stock : null
    console.log(_.get(defaultData, 'pageSize'))
    return {
        'stock': newStock,
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
