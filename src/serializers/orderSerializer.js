import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ONE = 1
const TWO = 2
const MINUS_ONE = -1
const THOU = 1000

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'value'])
    const discount = _.get(data, ['discount'])
    const clientContact = _.get(data, ['clientContact'])
    const isPaid = _.get(data, ['isPaid'])
    const filterServices = _.filter(_.get(data, ['service']), {state: true})
    return {
        service: _.map(filterServices, item => item.value),
        client,
        discount,
        paid: isPaid,
        'client_contact': clientContact
    }
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
        'exclude_cancelled': _.get(defaultData, 'exclude') ? null : 'True',
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'request_deadline_0': _.get(defaultData, 'deadlineFromDate'),
        'request_deadline_1': _.get(defaultData, 'deadlineToDate'),
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

