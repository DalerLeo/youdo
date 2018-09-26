import {hashHistory} from 'react-router'

const ordering = (filter, key, path) => {
  hashHistory.push({
    pathname: path,
    query: filter.getParams({'ordering': key})
  })
}

export default ordering
