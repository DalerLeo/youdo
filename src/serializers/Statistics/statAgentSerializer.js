import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (query) => {
    const {...defaultData} = query
    const ordering = _.get(query, 'ordering')

    const year = moment(_.get(query, 'date')).format('YYYY') || moment().format('YYYY')
    const month = moment(_.get(query, 'date')).format('M') || moment().format('M')

    return {
        month,
        year,
        'search': _.get(defaultData, 'search'),
        'zone': _.get(defaultData, 'zone'),
        'division': _.get(defaultData, 'division'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const itemSerializer = (data, filterItem, id) => {
    const {...defaultData} = data
    const daysInMonth = moment(_.get(defaultData, 'date')).daysInMonth()
    const begin = _.get(defaultData, 'date') ? moment(_.get(defaultData, 'date')).format('YYYY-MM-01') : moment().format('YYYY-MM-01')
    const end = _.get(defaultData, 'date') ? _.get(defaultData, 'date') + '-' + daysInMonth : moment().format('YYYY-MM-' + daysInMonth)

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

