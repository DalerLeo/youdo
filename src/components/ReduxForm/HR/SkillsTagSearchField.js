import React from 'react'
import CreatableMultiSelectFIeld from '../Basic/Creatable2MultiSelectFIeld'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const SkillsTagSearchField = (props) => {
  const {params, pageSize} = props
  return (
    <CreatableMultiSelectFIeld
      getValue={CreatableMultiSelectFIeld.defaultGetValue('fullName')}
      getText={CreatableMultiSelectFIeld.defaultGetText('fullName')}
      getOptions={search => searchFieldGetOptions(PATH.USERS_LIST, search, params, pageSize)}
      getIdsOption={(ids) => getIdsOption(ids, PATH.USERS_LIST)}
      getItemText={CreatableMultiSelectFIeld.defaultGetText('fullName')}
      withDetails={true}
      {...props}
    />
  )
}

export default SkillsTagSearchField
