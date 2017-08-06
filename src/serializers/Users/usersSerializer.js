import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const username = _.get(data, 'username')
    const firstName = _.get(data, 'firstName')
    const secondName = _.get(data, 'secondName')
    const phoneNumber = _.get(data, 'phoneNumber')
    const image = _.get(data, 'image')
    const password = _.get(data, 'password')
    const isActive = _.get(data, 'isActive')
    const groups = _.filter(_.get(data, ['groups']), (o) => {
        return _.get(o, 'selected')
    })
    const newGroup = _.map(groups, (val) => {
        return val.id
    })
    const stocks = _.filter(_.get(data, ['stocks']), (o) => {
        return _.get(o, 'selected')
    })

    const newStock = _.map(stocks, (val) => {
        return val.id
    })

    const markets = _.filter(_.get(data, ['markets']), (o) => {
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
        password,
        'groups': newGroup,
        'is_active': isActive,
        'stocks': newStock,
        'marketTypes': newMarket
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

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
