import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import t from '../../../helpers/translate'

const Items = [
  {id: 'single', name: t('Не женат / не замужем')},
  {id: 'married', name: t('Женат / замужем')}
]

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
