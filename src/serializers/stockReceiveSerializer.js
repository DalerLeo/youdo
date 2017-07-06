import _ from 'lodash'

export const createSerializer = (data) => {
    const amount = _.toNumber(_.get(data, 'amount'))
    const expDate = _.get(data, 'expDate')
    const barcode = _.get(data, 'barcode')
    const isDefect = _.get(data, 'isDefect') || false
    const comment = _.get(data, 'comment')
    const image = _.get(data, 'image')

    return {
        amount,
        expDate,
        barcode,
        'is_defect': isDefect,
        comment,
        image
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize')
    }
}

