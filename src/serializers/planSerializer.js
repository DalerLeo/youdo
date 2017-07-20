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

