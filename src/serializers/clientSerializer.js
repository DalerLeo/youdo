import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, 'name')
    const reference = _.get(data, ['reference', 'id']) || null

    const accounts = _
        .chain(data)
        .get('accounts')
        .map((item) => {
            return {
                number: _.get(item, 'account'),
                'fund_manager': _.get(item, ['fundManager', 'id']),
                broker: _.get(item, ['broker', 'id']) || _.get(item, ['broker', 'title'])
            }
        })
        .value()

    return {
        name,
        reference,
        accounts,
        'initial_capital': _.get(data, 'initialCapital'),
        'initial_capital_date': _.get(data, 'initialCapitalDate')
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData,
        'ordering': orderingSnakeCase(_.get(data, 'ordering'))
    }
}
