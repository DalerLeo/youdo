import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

const firstDayOfMonth = moment().format('YYYY-MM-01')
const lastDay = moment().daysInMonth()
const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'search': _.get(defaultData, 'search'),
        'stock': _.get(defaultData, 'stock'),
        'type': _.get(defaultData, 'typeParent') && (_.get(defaultData, 'type') || _.get(defaultData, 'typeParent')),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'ordering': ordering && orderingSnakeCase(ordering)

    }
}

export const diagramFilterSerializer = (data) => {
    const {...defaultData} = data
    return {
        'stock': _.get(defaultData, 'stock'),
        'type': _.get(defaultData, 'typeParent') && (_.get(defaultData, 'type') || _.get(defaultData, 'typeParent')),
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth
    }
}
