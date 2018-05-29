import _ from 'lodash'
const ZERO = 0
const numberWithoutSpaces = (amount) => {
  const first = _.replace(_.replace(_.replace(amount, ',', '.'), /\s/g, ''), '&nbsp;', '')
  if (_.isEmpty(first)) {
    return ZERO
  }
  return _.toNumber(first)
}

export default numberWithoutSpaces
