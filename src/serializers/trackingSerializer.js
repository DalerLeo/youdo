import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const agentLocationSerializer = (user, data) => {
    const split = 4
    const date = _.get(data, 'date')
    const begin = _.split(_.get(data, 'beginTime'), '-', split)
    const end = _.split(_.get(data, 'endTime'), '-', split)
    const beginH = _.get(begin, '0')
    const beginM = _.get(begin, '1')
    const endH = _.get(end, '0')
    const endM = _.get(end, '1')
    const beginDate = moment(date + ' ' + beginH + ':' + beginM + ':00').format('YYYY-MM-DD HH:mm:ss')
    const endDate = moment(date + ' ' + endH + ':' + endM + ':00').format('YYYY-MM-DD HH:mm:ss')
    return {
        'page_size': 6000,
        date,
        'begin_date': beginDate,
        'end_date': endDate,
        user
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering') || '-id'
    return {
        'begin_date': _.get(defaultData, 'manufacture'),
        'end_date': _.get(defaultData, 'group'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

