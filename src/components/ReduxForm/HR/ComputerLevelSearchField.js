import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import {HR_LEVEL_PC} from '../../../constants/backendConstants'

const Items = HR_LEVEL_PC

const getOptions = () => {
  return Promise.resolve(Items)
}

const getItem = (id) => {
  return Promise.resolve(
    _.find(Items, (o) => { return o.id === id }))
}

const ComputerLevelSearchField = (props) => {
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

export default ComputerLevelSearchField
