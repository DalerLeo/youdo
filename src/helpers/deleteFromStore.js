import _ from 'lodash'

const deleteFromStore = (id, list, action, innerObj = 'results') => {
    const newList = _.remove(_.get(list, innerObj), (item) => {
        return _.toNumber(item.id) !== _.toNumber(id)
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

export default deleteFromStore
