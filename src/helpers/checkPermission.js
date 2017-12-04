import * as storageHelper from '../helpers/storage'
import _ from 'lodash'

const checkPermission = (key) => {
    const userData = JSON.parse(storageHelper.getUserData())
    const permissions = _.map(_.get(userData, 'permissions'), (item) => {
        return _.get(item, 'codename')
    })
    return _.includes(permissions, key)
}

export default checkPermission
