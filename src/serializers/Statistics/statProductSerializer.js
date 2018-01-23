import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data, parent) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    const type = _.get(defaultData, 'productTypeChild') || _.get(defaultData, 'productType')
    return {
        'search': _.get(defaultData, 'search'),
        'client': _.get(defaultData, 'client') || null,
        'division': _.get(defaultData, 'division') || null,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        type,
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        parent
    }
}

