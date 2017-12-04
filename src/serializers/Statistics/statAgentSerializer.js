import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (query) => {
    const {...defaultData} = query
    const ordering = _.get(query, 'ordering')

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

    return {
        'begin_date': firstDayOfMonth,
        'end_date': lastDayOfMonth,
        'search': _.get(defaultData, 'search'),
        'zone': _.get(defaultData, 'zone') || null,
        'division': _.get(defaultData, 'division') || null,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const itemSerializer = (data, filterItem, id) => {
    const {...defaultData} = data
    const daysInMonth = moment(_.get(defaultData, 'end_date')).daysInMonth()
    const begin = _.get(defaultData, 'begin_date') ? moment(_.get(defaultData, 'begin_date')).format('YYYY-MM-01') : moment().format('YYYY-MM-01')
    const end = _.get(defaultData, 'end_date') ? _.get(defaultData, 'end_date') + '-' + daysInMonth : moment().format('YYYY-MM-' + daysInMonth)

    return {
        'user': id,
        'exclude_cancelled': 'True',
        'page': _.get(filterItem, 'dPage'),
        'page_size': _.get(filterItem, 'dPageSize'),
        'division': _.get(filterItem, 'division'),
        'created_date_0': begin,
        'created_date_1': end
    }
}

