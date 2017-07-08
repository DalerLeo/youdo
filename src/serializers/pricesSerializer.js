import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const beginDate = moment(_.get(data, 'beginDate')).format('YYYY-MM-DD')
    const tillDate = moment(_.get(data, 'tillDate')).format('YYYY-MM-DD')
    const name = _.get(data, 'name')
    const discount = _.get(data, ['discount'])
    const products = _.map(_.get(data, ['products']), (item) => {
        return {
            product: item.product.value.id,
            amount: item.amount
        }
    })

    return {
        'begin_date': beginDate,
        'till_date': tillDate,
        name,
        discount,
        products
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'begin_date_0': _.get(defaultData, 'beginFromDate'),
        'begin_date_1': _.get(defaultData, 'beginToDate'),
        'till_date_0': _.get(defaultData, 'tillFromDate'),
        'till_date_1': _.get(defaultData, 'tillToDate'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
