import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
  return axios().get(sprintf(PATH.POST_ITEM, id))
    .then(({data}) => Promise.resolve(toCamelCase(data)))
}

const PositionSearchField = (props) => {
  const {params, pageSize} = props

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(PATH.POST_LIST, search, params, pageSize)}
      getItem={getItem}
      getItemText={SearchField.defaultGetText('name')}
      parent={_.get(params, 'child')}
      {...props}
    />
  )
}

export default PositionSearchField
