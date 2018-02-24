import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data, manufacture, dateRange) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'opened_time': _.get(dateRange, 'beginDate'),
        'closed_time': _.get(dateRange, 'endDate'),
        'shift': _.get(defaultData, 'shift'),
        'manufacture': manufacture,
        'name': _.get(defaultData, 'name'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const logsFilterSerializer = (data, manufacture, dateRange) => {
    const {...defaultData} = data

    return {
        'begin_date': _.get(dateRange, 'beginDate'),
        'end_date': _.get(dateRange, 'endDate'),
        'manufacture': manufacture,
        'shift': _.get(defaultData, 'shift'),
        'type': _.get(defaultData, 'type'),
        'page': _.get(defaultData, 'logsPage'),
        'page_size': _.get(defaultData, 'logsPageSize')
    }
}

export const productsMaterialsCreate = (data) => {
    const shift = _.get(data, ['shift', 'value'])
    const date = moment(_.get(data, ['date'])).format('YYYY-MM-DD')
    const equipment = _.get(data, ['equipment', 'value'])
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            product: _.get(item, ['product', 'value', 'id']),
            amount: numberWithoutSpaces(_.get(item, 'amount'))
        }
    })
    return {
        products,
        shift,
        date,
        equipment
    }
}

export const inventorySerializer = (data, stock, dateRange) => {
    const {...defaultData} = data

    return {
        'shift': _.get(defaultData, 'shift'),
        beginDate: _.get(dateRange, 'beginDate'),
        endDate: _.get(dateRange, 'endDate'),
        stock: stock,
        type: 'manufacture_writeoff'
    }
}
