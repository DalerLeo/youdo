import _ from 'lodash'

const updateStore = (id, list, action, values) => {
    const newList = _.map(_.get(list, 'results'), (item) => {
        if (item.id === id) {
            _.merge(item, values)
        }
        return item
    })
    const newData = {...list, results: newList}
    const getNewData = () => {
        return Promise.resolve(newData)
    }

    return {
        type: action,
        payload: getNewData()
    }
}

export default updateStore
