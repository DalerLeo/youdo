import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/Search2Field'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
  return axios().get(sprintf(PATH.USERS_ITEM, id))
    .then(({data}) => {
      return Promise.resolve(toCamelCase(data))
    })
}

const UsersSearchField = (props) => {
  const {params, pageSize} = props
  const getText = (value) => {
    const firstName = _.get(value, 'fullName')
    return firstName
  }

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={getText}
      getOptions={search => searchFieldGetOptions(PATH.USERS_LIST, search, params, pageSize)}
      getItem={getItem}
      getItemText={getText}
      {...props}
    />
  )
}

export default UsersSearchField
