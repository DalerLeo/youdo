import _ from 'lodash'

const deleteFromStore = (id, list, action, innerObj = 'results') => {
  const newList = JSON.parse(JSON.stringify(list))

  _.remove(_.get(newList, innerObj), (item) => {
    return _.toNumber(item.id) === _.toNumber(id)
  })

  return {
    type: action,
    payload: Promise.resolve({...newList, count: _.size(_.get(newList, innerObj))})
  }
}

export default deleteFromStore
