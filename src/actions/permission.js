import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/permissionSerializer'

export const permissionListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.ACCESS_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ACCESS_LIST,
    payload
  }
}

export const permissionItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.ACCESS_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ACCESS_ITEM,
    payload
  }
}

export const setDateAction = (formValues, id) => {
  const requestData = serializers.setDateSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.ACCESS_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ACCESS_ITEM,
    payload
  }
}
