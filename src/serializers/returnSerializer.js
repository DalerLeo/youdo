import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const ONE = 1
const TWO = 2

export const listFilterSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const dept = _.toInteger(_.get(defaultData, 'dept'))

    if (id) {
        return {
            'id': id
        }
    }
    return {
        'id': _.get(defaultData, 'id'),
        'client': _.get(defaultData, 'client'),
        'division': _.get(defaultData, 'division'),
        'zone': _.get(defaultData, 'zone'),
        'user': _.get(defaultData, 'initiator'),
        'debt': dept === ONE ? true : (dept === TWO ? false : null),
        'market': _.get(defaultData, 'shop'),
        'dateDelivery': _.get(defaultData, 'dateDelivery'),
        'totalCost': _.get(defaultData, 'totalCost'),
        'totalBalance': _.get(defaultData, 'totalBalance'),
        'status': _.get(defaultData, 'status'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate') || _.get(defaultData, 'fromDate'),
        'delivery_date_0': _.get(defaultData, 'deliveryFromDate'),
        'delivery_date_1': _.get(defaultData, 'deliveryToDate') || _.get(defaultData, 'deliveryFromDate'),
        'search': _.get(defaultData, 'search'),

        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

