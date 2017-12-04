import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, order) => {
    const amount = _.get(data, 'amount')
    const cashbox = _.get(data, ['cashbox', 'value', 'id'])
    const currencyRate = _.get(data, 'currencyRate') || '0'
    if (currencyRate === '2') {
        return {
            order,
            'amount': numberWithoutSpaces(amount),
            cashbox,
            'rate_type': currencyRate,
            'custom_rate': currencyRate && numberWithoutSpaces(_.get(data, 'customRate'))
        }
    }
    return {
        order,
        'amount': numberWithoutSpaces(amount),
        cashbox,
        'rate_type': currencyRate
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'debt': true,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'market': _.get(defaultData, 'market') || null,
        'client': _.get(defaultData, 'client') || null,
        'payment_type': _.get(defaultData, 'paymentType')
    }
}

export const convertSerializer = (data) => {
    const date = _.get(data, 'createdDate')
    if (date) {
        return {
            'from_currency': _.get(data, 'fromCurrency'),
            'to_currency': _.get(data, 'toCurrency'),
            'amount': '1',
            'date': moment(date).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    return {
        'from_currency': _.get(data, 'fromCurrency'),
        'to_currency': _.get(data, 'toCurrency'),
        'amount': '1'
    }
}

