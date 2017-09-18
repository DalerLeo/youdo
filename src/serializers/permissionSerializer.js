import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const updateSerializer = (id, status) => {
    const statusChange = status === true ? '2' : '1'
    return {
        id,
        'status': statusChange
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
        'type': _.get(defaultData, 'type'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const setDateSerializer = (data) => {
    const setTime = _.get(data, 'setTime')
    const fromTime = _.get(data, 'fromTime')
    const toTime = _.get(data, 'toTime')

    return {
        'from_time': setTime ? null : moment(fromTime).format('HH:mm:ss'),
        'to_time': setTime ? null : moment(toTime).format('HH:mm:ss')
    }
}

