import * as storageHelper from '../helpers/storage'
import _ from 'lodash'

const userData = JSON.parse(storageHelper.getUserData())
const permissions = _.map(_.get(userData, 'permissions'), (item) => {
    return _.get(item, 'codename')
})

const checkPermission = (key) => {
    return _.includes(permissions, key)
}

export default checkPermission
