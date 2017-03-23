import _ from 'lodash'

export const pieChartFilterSerializer = (data) => {
    const fromDate = _.get(data, ['fromPieDate'])
    const toDate = _.get(data, ['toPieDate'])

    return {
        'from_date': fromDate,
        'to_date': toDate
    }
}

export const lineChartFilterSerializer = (data) => {
    const fromDate = _.get(data, ['fromLineDate'])
    const toDate = _.get(data, ['toLineDate'])

    return {
        'from_date': fromDate,
        'to_date': toDate
    }
}
