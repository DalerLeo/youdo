import _ from 'lodash'

export const createSerializer = (data) => {
    const noStatement = _.get(data, 'noStatement') || false
    const noTransaction = _.get(data, 'noTransaction') || false
    const noTransactionOrNoTransaction = noStatement || noTransaction
    const date = _.get(data, 'date')
    const account = _.get(data, ['account', 'id'])
    const operationType = noTransactionOrNoTransaction ? 'P' : _.get(data, 'operationType')
    const amount = noTransactionOrNoTransaction ? 0 : _.get(data, 'amount')
    const mtm = noTransactionOrNoTransaction ? 0 : _.get(data, 'mtm') || 0

    return {
        date,
        account,
        'type': operationType,
        amount,
        mtm,
        'no_statement': noStatement,
        'no_transaction': noTransaction
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData
    }
}
