import {find, flow} from 'lodash/fp'
import React from 'react'
import SearchField from './Basic/SearchField'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search, ITEMS) => Promise.resolve(ITEMS)
const getItem = (id, ITEMS) => Promise.resolve(
  flow(
    find('id'),
    toCamelCase
  )(ITEMS)
)

const StaticUniversalSearchField = (props) => {
  const {items, ...defaultProps} = props

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={search => getOptions(search, items)}
      getItem={(id) => getItem(id, items)}
      getItemText={SearchField.defaultGetText('name')}
      {...defaultProps}
    />
  )
}

export default StaticUniversalSearchField
