import _ from 'lodash'

const excludeObjKey = (obj, keys) => {
    return _.pickBy(obj, (value, key) => {
        const find = _
            .chain(keys)
            .indexOf(key)
            .value()
        return find < 0
    })
}

export default excludeObjKey
