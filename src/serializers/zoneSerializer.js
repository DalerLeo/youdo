import _ from 'lodash'

export const createSerializer = (data) => {
    const title = _.get(data, ['zoneName'])

    return {
        title,
        'coordinates': {
            'type': 'Polygon',
            'coordinates': [[
            ]]
        }
    }
}

export const bindAgentSerializer = (data) => {
    const agent = _.get(data, ['user', 'value'])

    return {
        'user_id': agent
    }
}

