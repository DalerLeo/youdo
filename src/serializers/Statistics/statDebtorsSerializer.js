import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'division': _.get(defaultData, 'division'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const itemSerializer = (id) => {
    return {
        'client': id,
        'dept': true
    }
}
