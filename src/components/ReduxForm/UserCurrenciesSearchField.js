import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import * as storageHelper from '../../helpers/storage'

const UserCurrenciesSearchField = (props) => {
  const userData = JSON.parse(storageHelper.getUserData())
  const currencies = _.get(userData, 'currencies')

  const getOptions = () => {
    return Promise.resolve(currencies)
  }

  const getItem = (id) => {
    return Promise.resolve(
      _.find(currencies, (o) => { return o.id === _.toInteger(id) })
    )
  }
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

export default UserCurrenciesSearchField
