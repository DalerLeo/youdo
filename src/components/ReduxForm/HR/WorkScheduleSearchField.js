import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import {HR_WORK_SCHEDULE} from '../../../constants/backendConstants'

const Items = HR_WORK_SCHEDULE

const getOptions = () => {
  return Promise.resolve(Items)
}

const getItem = (id) => {
  return Promise.resolve(
    _.find(Items, (o) => { return o.id === id }))
}

const WorkScheduleSearchField = (props) => {
  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={getOptions}
      getItem={getItem}
      getItemText={SearchField.defaultGetText('name')}
      {...props}
    />
  )
}

export default WorkScheduleSearchField
