import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
  return axios().get(sprintf(PATH.HR_LANGUAGE_ITEM, id))
    .then(({data}) => {
      return Promise.resolve(toCamelCase(data))
    })
}

const LanguageSearchField = (props) => {
  const {params, pageSize} = props

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(PATH.HR_LANGUAGE_LIST, search, params, pageSize)}
      getItem={getItem}
      getItemText={SearchField.defaultGetText('name')}
      {...props}
    />
  )
}

export default LanguageSearchField
