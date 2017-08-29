import _ from 'lodash'

export const marketSerializer = (data) => {
    const target = _.toInteger(_.get(data, 'target'))
    const filterMarkets = _.filter(_.get(data, 'markets'), (o) => {
        return target !== _.get(o, ['market', 'value'])
    })
    const markets = _.map(filterMarkets, (item) => {
        return _.toInteger(_.get(item, ['market', 'value']))
    })
    if (_.isEmpty(markets)) {
        return false
    }
    return {
        target,
        markets
    }
}

export const clientSerializer = (data) => {
    const target = _.toInteger(_.get(data, 'target'))
    const filterClients = _.filter(_.get(data, 'clients'), (o) => {
        return target !== _.get(o, ['client', 'value'])
    })
    const clients = _.map(filterClients, (item) => {
        return _.toInteger(_.get(item, ['client', 'value']))
    })
    if (_.isEmpty(clients)) {
        return false
    }
    return {
        target,
        clients
    }
}

