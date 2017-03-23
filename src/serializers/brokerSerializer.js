import _ from 'lodash'

export const createSerializer = (data) => {
    const name = _.get(data, 'name')

    return {
        name
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData
    }
}
