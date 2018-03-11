import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, id, manufacture) => {
    return {
        'product': id,
        'ingredient': _.get(data, ['ingredient', 'value']),
        'amount': numberWithoutSpaces(_.get(data, 'amount')),
        manufacture
    }
}

export const updateSerializer = (data, ingredient, product) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
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

