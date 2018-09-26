import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import {
  OFF_FULL_DAY,
  ON_TIME,
  ON_FULL_DAY,
  OFF_TIME,
  getPermName
} from '../../constants/permissionTime'

const Items = [
  {id: ON_FULL_DAY, name: getPermName[ON_FULL_DAY]},
  {id: OFF_FULL_DAY, name: getPermName[OFF_FULL_DAY]},
  {id: ON_TIME, name: getPermName[ON_TIME]},
  {id: OFF_TIME, name: getPermName[OFF_TIME]}
]

const getOptions = (search) => {
  return Promise.resolve(Items)
}

const getItem = (id) => {
  return Promise.resolve(
    _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const PermissionTimeSearchField = (props) => {
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

export default PermissionTimeSearchField
