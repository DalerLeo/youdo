import {find, flow} from 'lodash/fp'
import React from 'react'
import _ from 'lodash'
import Search2Field from './Basic/Search2Field'

const getOptions = (search, ITEMS) => Promise.resolve(ITEMS)
const getItem = (id, ITEMS) => Promise.resolve(
  _.find(ITEMS, {id})
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
