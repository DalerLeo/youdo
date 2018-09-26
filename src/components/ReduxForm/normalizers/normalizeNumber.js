import _ from 'lodash'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'

const normalizeNumber = (value) => {
  const numberValue = _.toNumber(numberWithoutSpaces(value))
  if (!value) {
    return value
  } else if (_.isNaN(numberValue)) {
    return ''
  }

  const onlyNums = _.replace(_.replace(value, ',', '.'), / /g, '')
  return onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default normalizeNumber
