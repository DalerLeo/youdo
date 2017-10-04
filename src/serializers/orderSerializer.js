import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ZERO = 0
const ONE = 1
const TWO = 2
const FIVE = 5

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const paymentType = _.get(data, ['paymentType'])
    const paymentTerm = 1
    const paymentDate = moment(_.get(data, ['paymentDate'])).format('YYYY-MM-DD')
    const deliveryDate = moment(_.get(data, ['deliveryDate'])).format('YYYY-MM-DD')
    const requestDeadline = moment(_.get(data, ['request_dedline'])).format('YYYY-MM-DD')
    const dealType = _.get(data, ['dealType']) === 'standart' ? ZERO : ONE
    const market = _.get(data, ['market', 'value', 'id'])
    const user = _.get(data, ['user', 'value'])
    const products = _.map(_.get(data, ['products']), (item) => {
        return {
            id: _.get(item, ['product', 'id']),
            amount: numberWithoutSpaces(_.get(item, 'amount')),
            custom_price: numberWithoutSpaces(_.get(item, 'cost')),
            product: _.get(item, ['product', 'value', 'id'])
        }
    })
    return {
        client,
        'date_delivery': deliveryDate,
        'request_dedline': requestDeadline,
        'payment_date': paymentDate,
        'payment_type': paymentType,
        'payment_term': paymentTerm,
        'deal_type': dealType,
        market,
        user,
        products
    }
}

export const listFilterSerializer = (data, id, withOrderReturn) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const dept = _.toInteger(_.get(defaultData, 'dept'))
    const status = _.get(defaultData, 'status') ? (_.toInteger(_.get(defaultData, 'status')) === FIVE ? ZERO : _.toInteger(_.get(defaultData, 'status'))) : null
    if (id) {
        return {
            'id': id
        }
    }
    return {
        'id': _.get(defaultData, 'id'),
        'starts_with': _.get(defaultData, 'startsWith'),
        'client': _.get(defaultData, 'client'),
        'product': _.get(defaultData, 'product'),
        'division': _.get(defaultData, 'division'),
        'zone': _.get(defaultData, 'zone'),
        'user': _.get(defaultData, 'initiator'),
        'debt': dept === ONE ? true : (dept === TWO ? false : null),
        'market': _.get(defaultData, 'shop'),
        'date_delivery': _.get(defaultData, 'dateDelivery'),
        'total_price': _.get(defaultData, 'totalPrice'),
        'total_balance': _.get(defaultData, 'totalBalance'),
        'status': status,
        'only_bonus': _.get(defaultData, 'onlyBonus') ? 'True' : null,
        'exclude_cancelled': _.get(defaultData, 'exclude') ? 'True' : null,
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'with_order_return': withOrderReturn,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

