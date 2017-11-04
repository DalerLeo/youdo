import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data, manufacture, dateRange) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'begin_date': _.get(dateRange, 'beginDate'),
        'end_date': _.get(dateRange, 'endDate'),
        'manufacture': manufacture,
        'name': _.get(defaultData, 'name'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const logsFilterSerializer = (data, manufacture, dateRange) => {
    const {...defaultData} = data

    return {
        'begin_date': _.get(dateRange, 'beginDate'),
        'end_date': _.get(dateRange, 'endDate'),
        'manufacture': manufacture,
        'page': _.get(defaultData, 'logsPage'),
        'page_size': _.get(defaultData, 'logsPageSize')
    }
}

