import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const market = _.get(data, ['market', 'value'])
    const phone = '+998' + _.get(data, ['phone'])
    return {
        market,
        phone
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
        'created_by': _.get(defaultData, 'createdBy') || null,
        'activation_date_0': _.get(defaultData, 'activatedFromDate') || null,
        'activation_date_1': _.get(defaultData, 'activatedToDate') || null,
        'begin_date': _.get(defaultData, 'createdFromDate') || null,
        'end_date': _.get(defaultData, 'createdToDate') || null

    }
}
export const logsFilterSerializer = (data) => {
    const {...defaultData} = data
    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'market_worker': _.get(defaultData, 'openLogsDialog') || null

    }
}

