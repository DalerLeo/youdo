import _ from 'lodash'

export const createSerializer = (data) => {
    const title = _.get(data, ['title'])
    const coordinates = _.get(data, 'polygon')
    const newCoordinates = [coordinates]
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

export const updateSerializer = (data) => {
    const title = _.get(data, ['title'])
    return {
        title
    }
}

export const createCustomSerializer = (title, points) => {
    const firstCoordinate = _.first(points)
    const cordinates = points
    if (cordinates) {
        cordinates.push(firstCoordinate)
    }
    return {
        title,
        'coordinates': {
            'type': 'Polygon',
            'coordinates': [cordinates]
        }
    }
}

export const updateCustomSerializer = (title, points) => {
    const firstCoordinate = _.first(points)
    let cordinates = points
    cordinates.push(firstCoordinate)

    return {
        title,
        'coordinates': {
            'type': 'Polygon',
            'coordinates': [cordinates]
        }
    }
}

export const bindAgentSerializer = (data) => {
    const agent = _.get(data, ['user', 'value'])

    return {
        'user_id': agent
    }
}

export const shopListSerializer = (page, zoneId) => {
    return {
        border: zoneId,
        page: page
    }
}

