import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import moment from 'moment'
export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'division': _.get(defaultData, 'division'),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}

export const itemFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize')
    }
}
