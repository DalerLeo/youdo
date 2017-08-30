import _ from 'lodash'
import numberWithoutSpaces from './numberWithoutSpaces'
import numberFormat from './numberFormat'
import getConfig from './getConfig'

const convertCurrency = (amount, rate) => {
    const reversedRate = !getConfig('REVERSED_CURRENCY_RATE')
    if (reversedRate) {
        return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) * _.toNumber(numberWithoutSpaces(rate))))
    }
    return (numberFormat(_.toNumber(numberWithoutSpaces(amount)) / _.toNumber(numberWithoutSpaces(rate))))
}

export default convertCurrency
