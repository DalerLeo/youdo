import _ from 'lodash'
import moment from 'moment'

export const agentLocationSerializer = (user, data) => {
    const date = _.get(data, 'date')
    const beginDate = moment(date).format('YYYY-MM-DD 00:00:00')
    const endDate = moment(date).format('YYYY-MM-DD 23:59:59')
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
    return {
        'group': _.get(defaultData, 'group'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': 6000
    }
}

