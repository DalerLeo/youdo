import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ZERO = 0

export const createSerializer = (data, productId, priceList) => {
    const prices = _.get(data, 'prices')
    const isPrimary = _.get(data, 'isPrimary')
    const isCustomPrice = _.get(data, 'agentCanChange')
    const minPrice = _.get(data, 'minPrice')
    const maxPrice = _.get(data, 'maxPrice')
    const customCurrency = _.get(data, ['priceCurrency', 'value'])

    const getPriceByType = (priceListId, type) => {
        const price = _.find(_.get(priceList, ['results']), (item) => {
            return item.priceList.id === priceListId
        })
        if (type === 'cash') {
            const val = _.get(price, 'cashPrice') || ZERO
            return _.toNumber(val)
        }
        const val = _.get(price, 'transferPrice') || ZERO
        return _.toNumber(val)
    }
    const getNum = (firstVal, byDefault) => {
        const first = _.replace(_.replace(firstVal, ',', '.'), / /g, '')
        if (_.isEmpty(first)) {
            return byDefault
        }
        return _.toNumber(first)
    }

    const newPrices = _.map(prices, (val) => {
        let obj = {
            'cash_price': getNum(_.get(val, 'cash_price'), getPriceByType(_.get(val, 'price_list'), 'cash')),
            'price_list': _.get(val, 'price_list'),
            'transfer_price': getNum(_.get(val, 'transfer_price'), getPriceByType(_.get(val, 'price_list'), 'transfer')),
            'cash_currency': _.get(val, ['cashCurrency', 'value']),
            'transfer_currency': _.get(val, ['transferCurrency', 'value'])
        }
        if (Number(isPrimary) === Number(obj.price_list)) {
            obj.is_primary = true
        }
        return obj
    })

    if (!isCustomPrice) {
        return {
            'product': productId,
            'prices': newPrices,
            'custom_price': isCustomPrice
        }
    }
    return {
        'product': productId,
        'prices': newPrices,
        'custom_price': isCustomPrice,
        'min_price': numberWithoutSpaces(minPrice),
        'max_price': numberWithoutSpaces(maxPrice),
        'currency': customCurrency
    }
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const type = _.get(defaultData, 'typeChild') || _.get(defaultData, 'typeParent')

    return {
        'manufacture': manufacture,
        'brand': _.get(defaultData, 'brand'),
        type,
        'measurement': _.get(defaultData, 'measurement'),
        'without_net_cost': _.get(defaultData, 'withoutNetCost') ? '1' : null,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const setPricesSerializer = (data) => {

    const cashCurrency = _.get(data, ['cashCurrency', 'value'])
    const transferCurrency = _.get(data, ['bankCurrency', 'value'])
    console.log(data, 'data')
    const products = _.map(_.get(data, 'products'), (item, index) => {
        if (!_.isEmpty(item)) {
            console.log(item, 'item')
            const prices = _.map(item, (priceItem, priceIndex) => {
                return {
                    'price_list': priceIndex,
                    'cash_price': _.get(priceItem, 'cashPrice'),
                    'transfer_price': _.get(priceItem, 'bankPrice')
                }
            })

            return {
                'product': index,
                'prices': _.filter(prices, (o) => {return !_.isEmpty(o.cash_price) || !_.isEmpty(o.transfer_price)}),
            }
        }
    })

    return {
        'products': _.filter(products, (o) => {return !_.isEmpty(o)}),
        'cash_currency': cashCurrency,
        'transfer_currency': transferCurrency
    }
}
