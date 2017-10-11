import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import moment from 'moment'

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const maxDay = 90
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

export const orderListFilterSerializer = (data, withOrderReturn) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'market': _.get(defaultData, 'shop'),
        'date_delivery': _.get(defaultData, 'dateDelivery'),
        'total_price': _.get(defaultData, 'totalPrice'),
        'total_balance': _.get(defaultData, 'totalBalance'),
        'created_date_0': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'created_date_1': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'with_order_return': withOrderReturn,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const returnGraphSerializer = (data) => {
    const {...defaultData} = data
    const urlFromDate = _.get(defaultData, 'fromDate')
    const urlToDate = _.get(defaultData, 'toDate')

    return {
        'begin_date': urlFromDate || firstDayOfMonth,
        'end_date': urlToDate || lastDayOfMonth,
        'division': _.get(defaultData, 'division')
    }
}
