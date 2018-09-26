import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/SearchField'
import axios from '../../helpers/axios'
import toCamelCase from '../../helpers/toCamelCase'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

const getItem = (id, path) => {
  return axios().get(sprintf(path, id))
    .then(({data}) => Promise.resolve(toCamelCase(data)))
}

const UniversalSearchField = (props) => {
  const {params, pageSize, itemPath, listPath} = props

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(listPath, search, params, pageSize)}
      getItem={(id) => getItem(id, itemPath)}
      getItemText={SearchField.defaultGetText('name')}
      parent={_.get(params, 'child')}
      {...props}
    />
  )
}

export default UniversalSearchField
