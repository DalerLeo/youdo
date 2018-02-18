import _ from 'lodash'
const moduleFormat = (amount, suffix) => {
    const ZERO = 0
    const FOUR = 4
    const formatter = new Intl.NumberFormat('ru-RU')
    const floor = _.floor(Math.abs(_.toNumber(amount)), FOUR)
    if (suffix) {
        return ((amount) ? formatter.format(floor) : ZERO) + ' ' + (suffix || '')
    }
    return ((amount) ? formatter.format(floor) : ZERO)
}

export default moduleFormat
