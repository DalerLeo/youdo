import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const listFilterSerializer = (query) => {
    const {...defaultData} = query
    const ordering = _.get(query, 'ordering')

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    const beginYear = moment(_.get(query, 'begin_date')).format('YYYY') || moment().format('YYYY')
    const beginMonth = moment(_.get(query, 'begin_date')).format('M') || moment().format('M')
    const endYear = moment(_.get(query, 'end_date')).format('YYYY') || moment().format('YYYY')
    const endMonth = moment(_.get(query, 'end_date')).format('M') || moment().format('M')

    return {
        'begin_date': firstDayOfMonth,
        'end_date': lastDayOfMonth,
        begin_month: beginMonth,
        begin_year: beginYear,
        end_month: endMonth,
        end_year: endYear,
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

