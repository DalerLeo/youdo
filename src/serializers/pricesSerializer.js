import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const beginDate = moment(_.get(data, 'beginDate')).format('YYYY-MM-DD')
    const tillDate = moment(_.get(data, 'tillDate')).format('YYYY-MM-DD')
    const name = _.get(data, 'name')
    const discount = _.get(data, ['discount']) || '0'
    const type = _.get(data, 'promotionType')
    const totalAmount = _.get(data, 'amount')
    let products = _.map(_.get(data, ['products']), (item) => {
        const product = _.get(item, ['product', 'value', 'id'])
        const amount = _.get(item, 'amount')
        return {
            product,
            amount
        }
    })
    if (type === 'bonus') {
        const bonus = _.map(_.get(data, ['bonusProducts']), (item) => {
            const product = _.get(item, ['bonusProduct', 'value', 'id'])
            return {
                product,
                'type': '1'
            }
        })
        const gift = _.map(_.get(data, ['giftProducts']), (item) => {
            const product = _.get(item, ['giftProduct', 'value', 'id'])
            const amount = _.get(item, 'giftAmount')
            return {
                product,
                amount,
                'type': '2'
            }
        })
        products = _.union(bonus, gift)
    }
    return {
        'begin_date': beginDate,
        'till_date': tillDate,
        name,
        discount,
        products,
        'total_amount': totalAmount,
        type
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'begin_date_0': _.get(defaultData, 'beginFromDate'),
        'begin_date_1': _.get(defaultData, 'beginToDate'),
        'till_date_0': _.get(defaultData, 'tillFromDate'),
        'till_date_1': _.get(defaultData, 'tillToDate'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

