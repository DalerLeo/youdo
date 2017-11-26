import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import toBoolean from '../../helpers/toBoolean'
import moment from 'moment'

const ZERO = 0
const ONE = 1
const TWO = 2
const FIVE = 5

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data, withOrderReturn) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const maxDay = 90
    const urlFromDate = _.get(defaultData, 'fromDate')
    const urlToDate = _.get(defaultData, 'toDate')
    const fromDay = moment(urlFromDate)
    const toDay = moment(urlToDate)
    const debt = _.toInteger(_.get(defaultData, 'dept'))
    const type = _.toInteger(toDay.diff(fromDay, 'days')) >= maxDay ? 'month' : 'day'
    const status = _.get(defaultData, 'status') ? (_.toInteger(_.get(defaultData, 'status')) === FIVE ? ZERO : _.toInteger(_.get(defaultData, 'status'))) : null
    const excludeCanceled = !_.isUndefined(_.get(defaultData, 'exclude')) ? toBoolean(_.get(defaultData, 'exclude')) : true

    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'begin_date': urlFromDate || firstDayOfMonth,
        'end_date': urlToDate || lastDayOfMonth,
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'border': _.get(defaultData, 'zone'),
        'user': _.get(defaultData, 'initiator'),
        'debt': debt === ONE ? true : (debt === TWO ? false : null),
        'market': _.get(defaultData, 'shop'),
        'status': status,
        'only_bonus': _.get(defaultData, 'onlyBonus') ? 'True' : null,
        'exclude_cancelled': excludeCanceled ? 'True' : null,
        'with_order_return': withOrderReturn,
        'product': _.get(defaultData, 'product'),
        'delivery_man': _.get(defaultData, 'deliveryMan'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'date_delivery': _.get(defaultData, 'dateDelivery'),
        'total_price': _.get(defaultData, 'totalPrice'),
        'total_balance': _.get(defaultData, 'totalBalance'),
        'created_date_0': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'created_date_1': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'request_deadline_0': _.get(defaultData, 'deadlineFromDate'),
        'request_deadline_1': _.get(defaultData, 'deadlineToDate') || _.get(defaultData, 'deadlineFromDate'),
        type
    }
}

export const orderListFilterSerializer = (data, withOrderReturn) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const debt = _.toInteger(_.get(defaultData, 'dept'))
    const status = _.get(defaultData, 'status') ? (_.toInteger(_.get(defaultData, 'status')) === FIVE ? ZERO : _.toInteger(_.get(defaultData, 'status'))) : null
    const excludeCanceled = !_.isUndefined(_.get(defaultData, 'exclude')) ? toBoolean(_.get(defaultData, 'exclude')) : true
    return {
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'border': _.get(defaultData, 'zone'),
        'user': _.get(defaultData, 'initiator'),
        'debt': debt === ONE ? true : (debt === TWO ? false : null),
        'market': _.get(defaultData, 'shop'),
        'status': status,
        'only_bonus': _.get(defaultData, 'onlyBonus') ? 'True' : null,
        'product': _.get(defaultData, 'product'),
        'exclude_cancelled': excludeCanceled ? 'True' : null,
        'delivery_man': _.get(defaultData, 'deliveryMan'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'with_order_return': withOrderReturn,
        'date_delivery': _.get(defaultData, 'dateDelivery'),
        'total_price': _.get(defaultData, 'totalPrice'),
        'total_balance': _.get(defaultData, 'totalBalance'),
        'created_date_0': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'created_date_1': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'request_deadline_0': _.get(defaultData, 'deadlineFromDate'),
        'request_deadline_1': _.get(defaultData, 'deadlineToDate') || _.get(defaultData, 'deadlineFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const returnGraphSerializer = (data) => {
    const {...defaultData} = data
    const urlFromDate = _.get(defaultData, 'fromDate')
    const urlToDate = _.get(defaultData, 'toDate')

    return {
        'created_date_0': urlFromDate || firstDayOfMonth,
        'created_date_1': urlToDate || lastDayOfMonth,
        'division': _.get(defaultData, 'division')
    }
}
