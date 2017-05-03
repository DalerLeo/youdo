import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const username = 'asd'
        // _.get(data, ['username'])
    const first_name = _.get(data, ['firstName'])
    const second_name = _.get(data, ['secondName'])
    const region = _.get(data, ['region'])
    const email = _.get(data, ['email'])
    const phone_number = _.get(data, ['phoneNumber'])
    const image = 1
        // _.get(data, ['img'])
    const password = _.get(data, ['password'])

    return {
        username,
        first_name,
        second_name,
        // region,
        // 'email': email,
        phone_number,
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
