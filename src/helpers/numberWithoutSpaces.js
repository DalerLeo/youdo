import _ from 'lodash'
const ZERO = 0
const TWO = 2
const numberWithoutSpaces = (amount) => {
    const first = _.replace(_.replace(amount, ',', '.'), / /g, '')
    if (_.isEmpty(first)) {
        return ZERO
    }
    return _.toNumber(first).toFixed(TWO)
}

export default numberWithoutSpaces
