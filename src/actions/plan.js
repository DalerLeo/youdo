import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/planSerializer'

export const planCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.PLAN_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_CREATE,
    payload
  }
}

export const planDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.PLAN_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_DELETE,
    payload
  }
}

export const planUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.PLAN_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_UPDATE,
    payload
  }
}

export const planListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.PLAN_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_LIST,
    payload
  }
}
export const planDublicateListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.PLAN_LIST_REPETITION, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_LIST_REPETITION,
    payload
  }
}

export const planItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.PLAN_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_ITEM,
    payload
  }
}

export const planJoinListFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.PLAN_ITEM_REPETITION, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PLAN_ITEM_REPETITION,
    payload
  }
}
