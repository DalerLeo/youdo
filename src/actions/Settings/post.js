import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Settings/postSerializer'

export const postCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.POST_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.POST_CREATE,
    payload
  }
}

export const postDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.POST_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.POST_DELETE,
    payload
  }
}

export const postUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.POST_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.POST_UPDATE,
    payload
  }
}

export const postListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.POST_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.POST_LIST,
    payload
  }
}

export const postItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.POST_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.POST_ITEM,
    payload
  }
}
