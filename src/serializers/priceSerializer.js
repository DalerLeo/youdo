import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const ZERO = 0

export const createSerializer = (data, productId, priceList) => {
    const prices = _.get(data, 'prices')
    const isPrimary = _.get(data, 'isPrimary')
    const isCustomPrice = _.get(data, 'agentCanChange')
    const minPrice = _.get(data, 'minPrice')
    const maxPrice = _.get(data, 'maxPrice')
    const customCurrency = _.get(data, ['priceCurrency', 'value'])
    const getPriceByType = (marketTypeId, type) => {
        const price = _.find(_.get(priceList, ['results']), (item) => {
            return item.marketType.id === marketTypeId
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
            'cash_price': getNum(_.get(val, 'cash_price'), getPriceByType(_.get(val, 'market_type'), 'cash')),
            'market_type': _.get(val, 'market_type'),
            'transfer_price': getNum(_.get(val, 'transfer_price'), getPriceByType(_.get(val, 'market_type'), 'transfer')),
            'currency': _.get(val, ['currency', 'value'])
        }
        if (Number(isPrimary) === Number(obj.market_type)) {
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
        'min_price': minPrice,
        'max_price': maxPrice,
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
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

