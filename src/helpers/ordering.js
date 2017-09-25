import {hashHistory} from 'react-router'

const ordering = (filter, key) => {
    hashHistory.push(filter.sortingURL(key))
}

export default ordering
