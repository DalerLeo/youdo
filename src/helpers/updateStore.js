import _ from 'lodash'

export const updateStore = (id, list, action, values, innerObj = 'results') => {
  const newList = _.map(_.get(list, innerObj), (item) => {
    if (item.id === id) {
      _.merge(item, values)
    }
    return item
  })
  const newData = {...list, [innerObj]: newList}
  const getNewData = () => {
    return Promise.resolve(newData)
  }

  return {
    type: action,
    payload: getNewData()
  }
}

export const updateDetailStore = (action, values) => {
  const getNewData = () => {
    return Promise.resolve(values)
  }
  return {
    type: action,
    payload: getNewData()
  }
}

