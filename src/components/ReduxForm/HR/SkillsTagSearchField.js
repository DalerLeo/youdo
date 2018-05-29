import React from 'react'
import CreatableMultiSelectFIeld from '../Basic/CreatableMultiSelectFIeld'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const SkillsTagSearchField = (props) => {
  const {params, pageSize} = props
  return (
        <CreatableMultiSelectFIeld
            getValue={CreatableMultiSelectFIeld.defaultGetValue('name')}
            getText={CreatableMultiSelectFIeld.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.HR_SKILLS_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.HR_SKILLS_LIST)}
            getItemText={CreatableMultiSelectFIeld.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
  )
}

export default SkillsTagSearchField
