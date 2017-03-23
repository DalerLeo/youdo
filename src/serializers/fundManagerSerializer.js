import _ from 'lodash'

export const createSerializer = (data) => {
    const username = _.get(data, 'username')
    const password = _.get(data, 'password')
    const firstName = _.get(data, 'firstName')
    const secondName = _.get(data, 'secondName')

    return {
        username,
        password,
        first_name: firstName,
        second_name: secondName
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData
    }
}
