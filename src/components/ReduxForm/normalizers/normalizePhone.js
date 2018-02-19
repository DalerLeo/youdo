import _ from 'lodash'

const normalizePhone = (number) => {
    return _.replace(_.replace(number, ',', '.'), / /g, '')
}

export default normalizePhone
