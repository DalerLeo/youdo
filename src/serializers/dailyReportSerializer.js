import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const listFilterSerializer = (data) => {
    return {
        'month': _.get(data, 'month'),
        'year': _.get(data, 'year'),
        'account': _.get(data, 'account'),
        'client': _.get(data, 'client'),
        'broker': _.get(data, 'broker'),
        'fund_manager': _.get(data, 'fundManager'),
        'ordering': orderingSnakeCase(_.get(data, 'ordering')),
        'page': _.get(data, 'page')
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
