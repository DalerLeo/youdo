import _ from 'lodash'
import numberWithoutSpaces from './numberWithoutSpaces'
import numberFormat from './numberFormat'
import toBoolean from './toBoolean'
import getConfig from './getConfig'

const primaryIsUSDConfig = toBoolean(getConfig('REVERSED_CURRENCY_RATE'))
export const convertCurrency = (amount, rate, primaryIsUSD) => {
  const isUSD = _.isUndefined(primaryIsUSD) ? primaryIsUSDConfig : primaryIsUSD
  if (isUSD) {
    return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) / _.toNumber(numberWithoutSpaces(rate))))
  }
  return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) / _.toNumber(numberWithoutSpaces(rate))))
}

