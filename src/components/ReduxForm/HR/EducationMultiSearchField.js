import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import {HR_EDUCATION} from '../../../constants/backendConstants'

const Items = HR_EDUCATION
const getOptions = () => {
  return Promise.resolve(Items)
}

const EducationMultiSearchField = (props) => {
  return (
    <MultiSelectField
      getValue={MultiSelectField.defaultGetValue('id')}
      getText={MultiSelectField.defaultGetText('name')}
      getOptions={getOptions}
      getIdsOption={getOptions}
      getItemText={MultiSelectField.defaultGetText('name')}
      {...props}
    />
  )
}

export default EducationMultiSearchField
