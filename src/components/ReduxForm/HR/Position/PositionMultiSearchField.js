import React from 'react'
import MultiSelectField from '../../Basic/MultiSelectField'
import * as PATH from '../../../../constants/api'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../../helpers/getIdsOption'

const PositionMultiSearchField = connect()((props) => {
  const {params, pageSize} = props
  return (
    <MultiSelectField
      getValue={MultiSelectField.defaultGetValue('id')}
      getText={MultiSelectField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(PATH.HR_POSITION_LIST, search, params, pageSize)}
      getIdsOption={(ids) => getIdsOption(ids, PATH.HR_POSITION_LIST)}
      getItemText={MultiSelectField.defaultGetText('name')}
      {...props}
    />
  )
})

export default PositionMultiSearchField
