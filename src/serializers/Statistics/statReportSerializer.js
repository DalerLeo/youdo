import _ from 'lodash'
import moment from 'moment'

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const firstDayOfMonth = moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = moment().format('YYYY-MM-' + lastDay)
    return {
        'begin_date': _.get(defaultData, 'fromDate') || firstDayOfMonth,
        'end_date': _.get(defaultData, 'toDate') || lastDayOfMonth,
        'division': _.get(defaultData, 'division')
    }
}

