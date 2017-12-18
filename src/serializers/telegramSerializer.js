import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const market = _.get(data, ['market', 'value'])
    return {
        market
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'market': _.get(defaultData, 'market') || null,
        'createdBy': _.get(defaultData, 'createdBy') || null,
        'activated_begin': _.get(defaultData, 'activatedFromDate') || null,
        'activated_end': _.get(defaultData, 'activatedToDate') || null,
        'created_begin': _.get(defaultData, 'createdFromDate') || null,
        'created_end': _.get(defaultData, 'createdToDate') || null

    }
}

