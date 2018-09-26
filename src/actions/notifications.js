import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import caughtCancel from '../helpers/caughtCancel'

const CancelToken = axios().CancelToken

export const notificationDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.NOTIFICATIONS_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.NOTIFICATIONS_DELETE,
    payload
  }
}

let notificationListFetchToken = null
export const notificationListFetchAction = (page) => {
  if (notificationListFetchToken) {
    notificationListFetchToken.cancel()
  }
  notificationListFetchToken = CancelToken.source()
  const payload = axios()
    .get(API.NOTIFICATIONS_LIST, {params: {page: page, page_size: 15}, cancelToken: notificationListFetchToken.token})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      caughtCancel(error)
      return Promise.reject(_.get(error, ['response', 'data']))
    })
  return {
    type: actionTypes.NOTIFICATIONS_LIST,
    payload
  }
}

export const notificationCountFetchAction = (type) => {
  const payload = axios()
    .get(API.NOTIFICATIONS_GET_COUNT, {params: {to: type}})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })
  return {
    type: actionTypes.NOTIFICATIONS_GET_COUNT,
    payload
  }
}
