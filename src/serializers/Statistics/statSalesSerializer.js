import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import moment from 'moment'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const maxDay = 90
    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    const urlFromDate = _.get(defaultData, 'fromDate')
    const urlToDate = _.get(defaultData, 'toDate')
    const fromDay = moment(urlFromDate)
    const toDay = moment(urlToDate)
    let type = 'day'
    if ((_.toInteger(toDay.diff(fromDay, 'days'))) >= maxDay) {
        type = 'month'
    }

    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': urlFromDate || firstDayOfMonth,
        'end_date': urlToDate || lastDayOfMonth,
        type
    }
}
