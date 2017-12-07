import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import getConfig from '../../helpers/getConfig'

const stockSelect = getConfig('MULTI_SELECT_STOCK')
export const createSerializer = (data) => {
    const singleStock = [_.get(data, 'radioStock')]
    const username = _.get(data, 'username')
    const firstName = _.get(data, 'firstName')
    const secondName = _.get(data, 'secondName')
    const phoneNumber = _.get(data, 'phoneNumber')
    const image = _.get(data, 'image')
    const password = _.get(data, 'password')
    const isActive = _.get(data, 'isActive')
    const position = _.get(data, ['position', 'value'])
    const job = _.get(data, ['job', 'value'])
    const stocks = _.filter(_.get(data, ['stocks']), (o) => {
        return _.get(o, 'selected')
    })

    const currencies = _.map(_.filter(_.get(data, ['currencies']), (o) => {
        return _.get(o, 'selected')
    }), (item) => {
        return _.get(item, 'id')
    })

    const newStock = _.map(stocks, (val) => {
        return val.id
    })

    const markets = _.filter(_.get(data, ['types']), (o) => {
        return _.get(o, 'selected')
    })

    const newMarket = _.map(markets, (val) => {
        return val.id
    })

    return {
        username,
        'first_name': firstName,
        'second_name': secondName,
        'phone_number': phoneNumber,
        image,
        job,
        password,
        position,
        'is_active': isActive,
        'stocks': stockSelect ? newStock : singleStock,
        'price_lists': newMarket,
        currencies
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering') || '-id'
    return {
        'manufacture': _.get(defaultData, 'manufacture'),
        'user_group': _.get(defaultData, 'group'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

