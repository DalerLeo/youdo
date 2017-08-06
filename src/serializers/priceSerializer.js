import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, productId) => {
    const prices = _.get(data, 'prices')
    const isPrimary = _.get(data, 'isPrimary')
    const newPrices = _.map(prices, (val) => {
        let obj = {
            'cash_price': _.replace(_.trim(_.get(val, 'cash_price')), ',', '.'),
            'market_type': _.get(val, 'market_type'),
            'transfer_price': _.replace(_.trim(_.get(val, 'transfer_price')), ',', '.'),
            'currency': _.get(val, ['currency', 'value'])
        }

        if (Number(isPrimary) === Number(obj.market_type)) {
            obj.is_primary = true
        }
        return obj
    })

    return {
        'product': productId,
        'prices': newPrices
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

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
