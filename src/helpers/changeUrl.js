import {hashHistory} from 'react-router'

export const replaceUrl = (filter, pathname, params) => {
  hashHistory.replace({pathname, query: filter.getParams({...params})})
}
export const changeUrl = (filter, pathname, params) => {
  hashHistory.push({pathname, query: filter.getParams({...params})})
}

