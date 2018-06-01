import React from 'react'
import _ from 'lodash'
import SearchField from './Basic/SearchField'

const ITEMS = [
  {id: 'uz', name: 'Узбекский'},
  {id: 'ru', name: 'Русский'}
]

const getOptions = () => Promise.resolve(ITEMS)
const getItem = (id) => Promise.resolve(_.find(ITEMS, {id}))

const LanguageSearchField = (props) => {
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

export default LanguageSearchField
