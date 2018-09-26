import _ from 'lodash'

const NOT_FOUND = -1

const excludeObjKey = (obj, keys) => {
  return _.pickBy(obj, (value, key) => {
    const find = _
      .chain(keys)
      .indexOf(key)
      .value()
    return find === NOT_FOUND
  })
}

export default excludeObjKey
