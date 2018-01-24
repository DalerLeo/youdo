import _ from 'lodash'
const numberFormat = (amount, suffix) => {
    const ZERO = 0
    const FOUR = 5
    const formatter = new Intl.NumberFormat('ru-RU')
    const floor = _.floor(_.toNumber(amount), FOUR)
    if (suffix) {
        return ((amount) ? formatter.format(floor) : ZERO) + ' ' + (suffix || '')
    }
    return ((amount) ? formatter.format(floor) : ZERO)
}

export default numberFormat
