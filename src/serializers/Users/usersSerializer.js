import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const username = _.get(data, 'username')
    const firstName = _.get(data, 'firstName')
    const secondName = _.get(data, 'secondName')
    const phoneNumber = _.get(data, 'phoneNumber')
    const photo = _.get(data, 'image')
    const password = _.get(data, 'password')
    const isActive = _.get(data, 'isActive')
    const position = _.get(data, ['position', 'value'])
    const job = _.get(data, ['job', 'value'])
    const stocks = _.get(data, 'stocks')
        .filter((item) => _.get(item, 'selected'))
        .map((item) => _.get(item, 'id'))
    const currencies = _(data)
        .get('currencies')
        .filter((item) => _.get(item, 'selected'))
        .map((item) => _.get(item, 'id'))
    const divisions = _(data)
        .get('divisions')
        .filter((item) => _.get(item, 'selected'))
        .map((item) => _.get(item, 'id'))

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
        photo,
        job,
        password,
        position,
        'is_active': isActive,
        'stocks': stocks,
        'price_lists': newMarket,
        currencies,
        divisions
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

