import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../../Basic/SearchField'
import axios from '../../../../helpers/axios'
import * as PATH from '../../../../constants/api'
import toCamelCase from '../../../../helpers/toCamelCase'
import * as actionTypes from '../../../../constants/actionTypes'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../../helpers/searchFieldGetOptions'

export const setItemAction = (data, loading) => {
  return {
    type: actionTypes.CLIENT_CONTACTS,
    data: data,
    loading: loading
  }
}

const getItem = (id, dispatch) => {
  dispatch(setItemAction(null, true))

  return axios().get(sprintf(PATH.CLIENT_ITEM, id))
    .then(({data}) => {
      dispatch(setItemAction(_.get(data, 'contacts'), false))
      return Promise.resolve(toCamelCase(data))
    })
}

const ClientSearchField = connect()((props) => {
  const {dispatch, params, pageSize, ...defaultProps} = props
  const test = (id) => {
    return getItem(id, dispatch)
  }

  return (
    <SearchField
      getValue={SearchField.defaultGetValue('id')}
      getText={SearchField.defaultGetText('name')}
      getOptions={search => searchFieldGetOptions(PATH.CLIENT_LIST, search, params, pageSize)}
      getItem={test}
      getItemText={SearchField.defaultGetText('name')}
      withDetails={true}
      {...defaultProps}
    />
  )
})

export default ClientSearchField
