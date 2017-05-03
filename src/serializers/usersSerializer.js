import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const username = _.get(data, ['email'])
    const firstName = _.get(data, ['firstName'])
    const secondName = _.get(data, ['secondName'])
    const phoneNumber = _.get(data, ['phoneNumber'])
    const image = _.get(data, ['image'])
    const password = _.get(data, ['password'])

    return {
        username,
        'first_name': firstName,
        'second_name': secondName,
        'phone_number': phoneNumber,
        image,
        password
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'firstName': _.get(defaultData, 'firstName'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
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
