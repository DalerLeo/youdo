import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, 'name')
    const barcode = _.get(data, 'barcode')
    const parentCell = _.get(data, ['parentCell', 'value'])
    const childCell = _.get(data, ['childCell', 'value'])

    return {
        name,
        barcode,
        'cell_type': parentCell && (childCell || parentCell)
    }
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'manufacture': manufacture,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
