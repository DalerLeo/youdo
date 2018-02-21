import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const TYPE_PAYMENT = 1
export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'type': TYPE_PAYMENT,
        'client_confirmation': _.get(defaultData, 'status'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const totalSumFilterSerializer = (data) => {
    const {...defaultData} = data
    return {
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'type': TYPE_PAYMENT
    }
}

