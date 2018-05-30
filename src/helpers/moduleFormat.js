import _ from 'lodash'
const moduleFormat = (amount, suffix) => {
  const ZERO = 0
  const FLOOR = 2
  const formatter = new Intl.NumberFormat('ru-RU')
  const floor = _.floor(Math.abs(_.toNumber(amount)), FLOOR)
  if (suffix) {
    return ((amount) ? formatter.format(floor) : ZERO) + ' ' + (suffix || '')
  }
  return ((amount) ? formatter.format(floor) : ZERO)
}

export default moduleFormat
