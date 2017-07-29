import _ from 'lodash'
import moment from 'moment'

export const listFilterSerializer = (data, type, thumbnailType) => {
    const TEN = 10
    const date = _.get(data, 'date') || moment().format('YYYY-MM')
    let day = _.get(data, 'day') || moment().format('DD')
    if (_.toInteger(day) < TEN) {
        day = '0' + day
    }
    const fullDate = date + '-' + day

    return {
        'date': fullDate,
        'type': type,
        'thumbnail_type': thumbnailType
    }
}

