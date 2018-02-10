import _ from 'lodash'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'

const normalizeNumber = (value, amount) => {
    const numberValue = _.toNumber(numberWithoutSpaces(value))
    if (!value) {
        return value
    } else if (_.isNaN(numberValue)) {
        return ''
    }

    const formVal = amount && numberValue > _.toNumber(numberWithoutSpaces(amount)) ? amount : value
    const onlyNums = _.replace(_.replace(formVal, ',', '.'), / /g, '')
    return onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default normalizeNumber
