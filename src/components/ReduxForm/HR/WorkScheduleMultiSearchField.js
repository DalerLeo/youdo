import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import {HR_WORK_SCHEDULE} from '../../../constants/backendConstants'

const Items = HR_WORK_SCHEDULE
const getOptions = () => {
  return Promise.resolve(Items)
}

const WorkScheduleMultiSearchField = (props) => {
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

export default WorkScheduleMultiSearchField
