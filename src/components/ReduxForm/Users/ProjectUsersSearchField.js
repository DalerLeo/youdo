import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/Search2InlineField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from 'helpers/caughtCancel'

const CancelToken = axios().CancelToken
let listToken = null
const PAGE_SIZE = 100

const getOptions = (api, search, params, pageSize = PAGE_SIZE) => {
  if (listToken) {
    listToken.cancel()
  }
  listToken = CancelToken.source()
  return axios().get(api, {params: _.merge(_.merge(params, {search}), {page_size: pageSize}), cancelToken: listToken.token})
    .then(({data}) => {
      const datum = [
        {
          fullName: 'Все Проекты',
          id: ''
        }
      ]
      if (data.results) {
        return Promise.resolve(toCamelCase(_.union(data.results, datum)))
      }
      return Promise.resolve(toCamelCase(_.union(data, datum)))
    })
    .catch((error) => {
      caughtCancel(error)
    })
}

const getItem = (id) => {
  return axios().get(sprintf(PATH.USERS_ITEM, id))
    .then(({data}) => {
      return Promise.resolve(toCamelCase(data))
    })
}

const UsersSearchField = (props) => {
  const {params, pageSize} = props
  const getText = (value) => {
    const fullName = _.get(value, 'fullName')
    if (value.id) return 'Проекты: ' + fullName

    return fullName
  }

  return (
    <SearchField
      getValue={(v) => _.get(v, 'id')}
      getText={getText}
      getOptions={search => getOptions(PATH.USERS_LIST, search, params, pageSize)}
      getItem={getItem}
      getItemText={getText}
      {...props}
    />
  )
}

export default UsersSearchField
