import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data, id, manufacture) => {
    const ingredients = [
        {
            ingredient: _.get(data, ['ingredient', 'value']),
            amount: _.get(data, 'amount')
        }
    ]
    return {
        'product': id,
        'ingredients': ingredients,
        manufacture
    }
}

export const updateSerializer = (data, product) => {
    const ingredient = _.get(data, ['ingredient', 'value'])
    const amount = _.get(data, 'amount')
    return {
        product,
        ingredient,
        amount
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

