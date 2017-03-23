import _ from 'lodash'

export const createSerializer = (data) => {
    const year = _.get(data, 'year')
    const month = _.get(data, 'month')
    const account = _.get(data, ['account', 'id'])
    const openingBalance = _.get(data, 'openingBalance')
    const grossBalance = _.get(data, 'grossBalance')
    const grossProfit = _.get(data, 'grossProfit')
    const mtm = _.get(data, 'mtm')

    return {
        year,
        month,
        account,
        opening_balance: openingBalance,
        gross_balance: grossBalance,
        gross_profit: grossProfit,
        mtm
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData,
        format: 'csv'
    }
}
