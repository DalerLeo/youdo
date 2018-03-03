import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'
import toBoolean from '../helpers/toBoolean'

const STANDART = 0
const CONSIGNMENT = 1
const INDIVIDUAL_DEAL_TYPE = 2
const ONE = 1
const TWO = 2
const MINUS_ONE = -1
const THOU = 1000

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const paymentType = _.get(data, ['paymentType'])
    const deliveryType = _.get(data, ['deliveryType', 'value'])
    const deliveryMan = deliveryType === 'self' ? null : _.get(data, ['deliveryMan', 'value'])
    const paymentTerm = 1
    const paymentDate = _.get(data, ['paymentDate']) ? moment(_.get(data, ['paymentDate'])).format('YYYY-MM-DD') : null
    const deliveryDate = _.get(data, ['deliveryDate']) ? moment(_.get(data, ['deliveryDate'])).format('YYYY-MM-DD') : null
    const requestDeadline = _.get(data, ['requestDeadline']) ? moment(_.get(data, ['requestDeadline'])).format('YYYY-MM-DD') : null
    const dealType = _.get(data, ['dealType']) === 'standart' ? STANDART : (_.get(data, ['dealType']) === 'consignment' ? CONSIGNMENT : INDIVIDUAL_DEAL_TYPE)
    const market = _.get(data, ['market', 'value'])
    const contract = _.get(data, ['contract'])
    const deliveryPrice = _.get(data, ['deliveryPrice'])
    const priceList = _.get(data, ['priceList', 'value'])
    const user = _.get(data, ['user', 'value'])
    const currency = _.get(data, ['currency', 'value'])
    const isConfirmed = _.get(data, ['isConfirmed'])
    const products = _.map(_.get(data, ['products']), (item) => {
        return {
            id: _.get(item, ['product', 'id']),
            amount: numberWithoutSpaces(_.get(item, 'amount')),
            custom_price: numberWithoutSpaces(_.get(item, 'cost')),
            product: _.get(item, ['product', 'value', 'id'])
        }
    })
    const nextPaymentDate = _.get(data, ['dealType']) === 'consignment'
        ? moment(_.get(data, ['nextPaymentDate'])).format('YYYY-MM-DD')
        : null
    const request = deliveryType === 'self'
        ? {
            client,
            currency,
            contract,
            'payment_date': paymentDate,
            'payment_type': paymentType,
            'payment_term': paymentTerm,
            'deal_type': dealType,
            'delivery_type': deliveryType,
            'next_payment_date': nextPaymentDate,
            market,
            user,
            products,
            'delivery_price': deliveryPrice,
            'is_confirmed': isConfirmed,
            'price_list': priceList === MINUS_ONE ? null : priceList,
            'with_net_cost': priceList === MINUS_ONE ? ONE : false
        }
        : {
            client,
            currency,
            contract,
            'date_delivery': deliveryDate,
            'payment_date': paymentDate,
            'payment_type': paymentType,
            'payment_term': paymentTerm,
            'deal_type': dealType,
            'next_payment_date': nextPaymentDate,
            'delivery_type': deliveryType,
            'delivery_man': deliveryMan,
            'is_confirmed': isConfirmed,
            market,
            user,
            products,
            'delivery_price': deliveryPrice,
            'price_list': priceList === MINUS_ONE ? null : priceList,
            'with_net_cost': priceList === MINUS_ONE ? ONE : false
        }
    if (requestDeadline) {
        return _.merge(request, {'request_deadline': requestDeadline})
    }
    return request
}

export const multiUpdateSerializer = (data, orders, release) => {
    const deliveryDate = moment(_.get(data, ['deliveryDate'])).format('YYYY-MM-DD')
    const paymentDate = moment(_.get(data, ['paymentDate'])).format('YYYY-MM-DD')
    const deliveryMan = _.get(data, ['deliveryMan', 'value'])
    return {
        order_list: _.split(orders, '-'),
        date_delivery: deliveryDate,
        payment_date: paymentDate,
        delivery_man: deliveryMan,
        release
    }
}

export const listFilterSerializer = (data, id, withOrderReturn, print) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const dept = _.toInteger(_.get(defaultData, 'dept'))
    const status = _.get(defaultData, 'status')
    const excludeCanceled = toBoolean(_.get(defaultData, 'exclude')) ? null : 'True'

    if (id && print) {
        return {
            'ids': id
        }
    }

    if (id) {
        return {
            'ids': id
        }
    }
    const orders = _.get(data, 'select')
    return {
        'ids': print ? orders : null,
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client') || null,
        'product': _.get(defaultData, 'product') || null,
        'division': _.get(defaultData, 'division') || null,
        'border': _.get(defaultData, 'zone') || null,
        'user': _.get(defaultData, 'initiator'),
        'debt': dept === ONE ? true : (dept === TWO ? false : null),
        'market': _.get(defaultData, 'shop') || null,
        'date_delivery': _.get(defaultData, 'dateDelivery'),
        'delivery_man': _.get(defaultData, 'deliveryMan') || null,
        'total_price': _.get(defaultData, 'totalPrice'),
        'total_balance': _.get(defaultData, 'totalBalance'),
        'status': status,
        'only_bonus': _.get(defaultData, 'onlyBonus') ? 'True' : null,
        'is_new': _.get(defaultData, 'isNew') ? 'True' : null,
        'exclude_cancelled': excludeCanceled,
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'request_deadline_0': _.get(defaultData, 'deadlineFromDate'),
        'request_deadline_1': _.get(defaultData, 'deadlineToDate') || _.get(defaultData, 'deadlineFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'with_order_return': withOrderReturn,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const priceListFilterSerializer = (orderId, priceList, size = THOU, products, currency) => {
    if (priceList === MINUS_ONE) {
        return {
            'net_cost': ONE,
            'page_size': size,
            products,
            currency
        }
    }
    return {
        'order': orderId,
        'price_list': priceList,
        'page_size': size,
        products,
        currency
    }
}

