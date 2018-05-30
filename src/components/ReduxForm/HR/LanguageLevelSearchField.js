import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import {HR_LANG_LEVELS} from '../../../constants/backendConstants'

const Items = HR_LANG_LEVELS

const getOptions = () => {
  return Promise.resolve(Items)
}

const getItem = (id) => {
  return Promise.resolve(
    _.find(Items, (o) => { return o.id === id }))
}

const LanguageLevelSearchField = (props) => {
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

export default LanguageLevelSearchField
