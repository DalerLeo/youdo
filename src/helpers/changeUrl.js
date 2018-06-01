import {hashHistory} from 'react-router'

const changeUrl = (filter, pathname, params) => {
  hashHistory.push({pathname, query: filter.getParams({...params})})
}

export default changeUrl
