import _ from 'lodash'
const ZERO = 0
const numberWithoutSpaces = (amount) => {
    if (amount) {
        return _.toNumber(amount.replace(/[^\d]/g, ''))
    }
    return ZERO
}

export default numberWithoutSpaces
