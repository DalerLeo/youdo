import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const listFilterSerializer = (data) => {
    // .. const ONE = 1
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        // 'group': _.get(defaultData, 'group') || ONE,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const monthlyPlanSerializer = (data, query, user) => {
    const amount = _.toNumber(numberWithoutSpaces(_.get(data, 'amount')))
    const year = moment(_.get(query, 'date')).format('YYYY') || moment().format('YYYY')
    const month = moment(_.get(query, 'date')).format('M') || moment().format('M')

    return {
        user,
        amount,
        month,
        year
    }
}

