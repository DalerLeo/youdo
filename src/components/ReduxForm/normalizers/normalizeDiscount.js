import _ from 'lodash'
const normalizeDiscount = value => {
  const numberValue = _.toNumber(value)
  const MAX = 99
  if (!value) {
    return value
  } else if (_.isNaN(numberValue)) {
    return ''
  }
  const onlyNums = _.replace(_.replace(value, ',', '.'), / /g, '')
  return numberValue > MAX ? MAX : onlyNums
}

export default normalizeDiscount
