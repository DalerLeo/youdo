import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/Search2Field'
import axios from '../../helpers/axios'
import toCamelCase from '../../helpers/toCamelCase'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

const getItem = (id, path) => {
  console.warn(id, path)
  return axios().get(sprintf(path, id))
    .then(({data}) => Promise.resolve(toCamelCase(data)))
}

const UniversalSearchField = (props) => {
  const {params, pageSize, itemPath, listPath, textName, valueName} = props

  return (
    <SearchField
      getValue={SearchField.defaultGetValue(valueName || 'id')}
      getText={SearchField.defaultGetText(textName || 'name')}
      getOptions={search => searchFieldGetOptions(listPath, search, params, pageSize)}
      getItem={(id) => getItem(id, itemPath)}
      getItemText={SearchField.defaultGetText(textName || 'name')}
      parent={_.get(params, 'child')}
      {...props}
    />
  )
}

export default UniversalSearchField
