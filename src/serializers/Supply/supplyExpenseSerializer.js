import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

export const createSerializer = (data, id) => {
    const supply = id

    const amount = numberWithoutSpaces(_.get(data, ['amount']))
    const currency = _.get(data, ['currency', 'value'])
    const comment = _.get(data, ['comment'])

    return {
        supply,
        amount,
        currency,
        comment
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'provider': _.get(defaultData, 'provider'),
        'stock': _.get(defaultData, 'stock'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const expenseSupplySerializer = (supplyId) => {
    return {
        'supply': supplyId
    }
}

