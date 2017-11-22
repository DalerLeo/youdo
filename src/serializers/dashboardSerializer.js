import _ from 'lodash'
import moment from 'moment'

export const orderChart = (data) => {
    const {...defaultData} = data
    const urlFromDate = _.get(defaultData, 'beginDate') || moment().format('YYYY-MM-DD')
    const urlToDate = _.get(defaultData, 'endDate') || moment().format('YYYY-MM-DD')

    return {
        'exclude_cancelled': 'True',
        'begin_date': urlFromDate,
        'end_date': urlToDate
    }
}

