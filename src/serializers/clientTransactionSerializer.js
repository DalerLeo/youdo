import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'type': _.get(defaultData, 'type'),
        'client_confirmation': _.get(defaultData, 'status'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

