import _ from 'lodash'
const numberFormat = (amount, suffix) => {
    const ZERO = 0
    const TWO = 2
    const formatter = new Intl.NumberFormat('ru-RU')
    const floor = _.floor(_.toNumber(amount), TWO)
    if (suffix) {
        return ((amount) ? formatter.format(floor) : ZERO) + ' ' + (suffix || '')
    }
    return ((amount) ? formatter.format(floor) : ZERO)
}

export default numberFormat
