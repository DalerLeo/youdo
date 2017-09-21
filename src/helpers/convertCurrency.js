import _ from 'lodash'
import numberWithoutSpaces from './numberWithoutSpaces'
import numberFormat from './numberFormat'
import toBoolean from './toBoolean'
import getConfig from './getConfig'

const primaryIsUSD = toBoolean(getConfig('REVERSED_CURRENCY_RATE'))
export const convertCurrency = (amount, rate) => {
    if (primaryIsUSD) {
        return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) / _.toNumber(numberWithoutSpaces(rate))))
    }
    return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) * _.toNumber(numberWithoutSpaces(rate))))
}

export const converToUZS = (amount, rate) => {
    if (!primaryIsUSD) {
        return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) / _.toNumber(numberWithoutSpaces(rate))))
    }
    return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) * _.toNumber(numberWithoutSpaces(rate))))
}
