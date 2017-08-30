import _ from 'lodash'

export const createSerializer = (data) => {
    const title = _.get(data, ['zoneName'])
    const coordinates = _.get(data, 'polygon')
    let newCoordinates = [coordinates]
    const firstCoordinate = _.first(coordinates)
    coordinates.push(firstCoordinate)
    return {
        title,
        'coordinates': {
            'type': 'Polygon',
            'coordinates': newCoordinates
        }
    }
}

export const bindAgentSerializer = (data) => {
    const agent = _.get(data, ['user', 'value'])

    return {
        'user_id': agent
    }
}

