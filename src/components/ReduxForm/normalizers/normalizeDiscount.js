import _ from 'lodash'
const normalizeDiscount = value => {
    const numberValue = _.toNumber(value)
    const MAX = 100
    if (_.isNaN(numberValue) || value === '') {
        return ''
    }

    return numberValue > MAX ? MAX : value
}

export default normalizeDiscount
