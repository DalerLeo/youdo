import _ from 'lodash'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'

const normalizeMaxNumber = (value, amount) => {
  const numberValue = _.toNumber(numberWithoutSpaces(value))
  const amountValue = _.toNumber(numberWithoutSpaces(amount))
  if (!value) {
    return value
  } else if (_.isNaN(numberValue)) {
    return ''
  }
  const formVal = _.isNumber(amount) && (numberValue > amountValue) ? amountValue : value
  const onlyNums = _.replace(_.replace(formVal, ',', '.'), / /g, '')
  return onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default normalizeMaxNumber
