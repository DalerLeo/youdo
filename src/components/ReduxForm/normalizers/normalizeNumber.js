import _ from 'lodash'

const normalizeNumber = value => {
    if (!value) {
        return value
    }

    const onlyNums = _.replace(_.replace(value, ',', '.'), / /g, '')
    return onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default normalizeNumber
