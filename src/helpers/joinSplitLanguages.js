import _ from 'lodash'
export const langQueryFormat = (value) => {
    return _.map(value, (item) => {
        const name = _.get(item, ['name', 'value'])
        const level = _.get(item, ['level', 'value'])
        return name && level
            ? name + '-' + level
            : null
    })
}

export const langArrayFormat = (value) => {
    return _.map(_.split(value, '|'), (item) => {
        const name = _.parseInt(item)
        const level = _.trimStart(item, name + '-')
        return {
            name: {value: name || ''},
            level: {value: level || ''}
        }
    })
}

