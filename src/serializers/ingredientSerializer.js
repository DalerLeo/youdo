import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data, id) => {
    const ingredients = _.map(_.get(data, ['ingredients']), (item) => {
        return {
            amount: item.amount,
            ingredient: item.ingredient.value
        }
    })
    const amount = _.get(data, 'amount')
    return {
        'product': id,
        'ingredients': ingredients,
        'amount': amount
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
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
