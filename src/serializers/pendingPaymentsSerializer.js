import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, order) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const comment = _.get(data, 'comment')
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:mm:00')
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const cashbox = _.get(data, ['cashbox', 'value'])
    const incomeCategory = _.get(data, ['incomeCategory', 'value', 'id'])
    const currencyRate = _.get(data, 'currencyRate')
    const division = _.get(data, ['division', 'value'])

    const getRateType = () => {
        switch (currencyRate) {
            case 'current': return '0'
            case 'order': return '1'
            case 'custom': return '2'
            default: return '0'
        }
    }

    return {
        date,
        amount,
        cashbox,
        division,
        comment,
        order,
        custom_rate: customRate,
        income_category: incomeCategory,
        rate_type: getRateType()
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
        'division': _.get(defaultData, 'division') || null,
        'client': _.get(defaultData, 'client') || null,
        'payment_type': _.get(defaultData, 'paymentType')
    }
}

export const convertSerializer = (data, order, withoutDate) => {
    const date = _.get(data, 'createdDate')
    const request = {
        'from_currency': _.get(data, 'fromCurrency'),
        'to_currency': _.get(data, 'toCurrency'),
        'amount': '1',
        order
    }
    if (!withoutDate && date) {
        return _.merge(request, {'date': moment(date).format('YYYY-MM-DD HH:mm:ss')})
    }
    return request
}

