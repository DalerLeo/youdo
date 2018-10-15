import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from 'constants/api'
import searchFieldGetOptions from 'helpers/searchFieldGetOptions'
import getIdsOption from 'helpers/getIdsOption'

const UserMultiSearchField = (props) => {
  const {params, pageSize} = props
  return (
    <MultiSelectField
      getValue={MultiSelectField.defaultGetValue('id')}
      getText={MultiSelectField.defaultGetText('fullName')}
      getOptions={search => searchFieldGetOptions(PATH.USERS_LIST, search, params, pageSize)}
      getIdsOption={(ids) => getIdsOption(ids, PATH.USERS_LIST)}
      getItemText={MultiSelectField.defaultGetText('fullName')}
      {...props}
    />
  )
}

export default UserMultiSearchField
