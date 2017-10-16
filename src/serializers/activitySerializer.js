import _ from 'lodash'
import moment from 'moment'

export const listFilterSerializer = (data, type, page, thumbnailType) => {
    const TEN = 10
    const date = _.get(data, 'date') || moment().format('YYYY-MM')
    let day = _.get(data, 'day') || moment().format('D')
    if (_.toInteger(day) < TEN) {
        day = '0' + day
    }
    const fullDate = date + '-' + day

    return {
        page,
        'date': fullDate,
        'type': type,
        'thumbnail_type': thumbnailType
    }
}

