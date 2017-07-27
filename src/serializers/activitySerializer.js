import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const listFilterSerializer = (data) => {
    const ONE = 1
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'group': _.get(defaultData, 'group') || ONE,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

