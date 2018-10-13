import {find, flow} from 'lodash/fp'
import React from 'react'
import Search2Field from './Basic/Search2Field'
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
    <Search2Field
      getValue={Search2Field.defaultGetValue('id')}
      getText={Search2Field.defaultGetText('name')}
      getOptions={search => getOptions(search, items)}
      getItem={(id) => getItem(id, items)}
      getItemText={Search2Field.defaultGetText('name')}
      {...defaultProps}
    />
  )
}

export default StaticUniversalSearchField
