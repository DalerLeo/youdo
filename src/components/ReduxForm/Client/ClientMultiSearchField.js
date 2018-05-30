import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const ClientMultiSearchField = connect()((props) => {
  const {params, pageSize} = props
  return (
    <MultiSelectField
      getValue={MultiSelectField.defaultGetValue('id')}
      getText={MultiSelectField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(PATH.CLIENT_LIST, search, params, pageSize)}
      getIdsOption={(ids) => getIdsOption(ids, PATH.CLIENT_LIST)}
      getItemText={MultiSelectField.defaultGetText('name')}
      {...props}
    />
  )
})

export default ClientMultiSearchField
