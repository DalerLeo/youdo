import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const agentLocationSerializer = (user, date) => {
    return {
        'page_size': 6000,
        'begin_date': date,
        'end_date': date,
        user
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering') || '-id'
    return {
        'begin_date': _.get(defaultData, 'manufacture'),
        'end_date': _.get(defaultData, 'group'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

