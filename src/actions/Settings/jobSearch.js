import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Settings/jobSearchSerializer'

export const jobSearchCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.JOB_SEARCH_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_CREATE,
    payload
  }
}

export const jobSearchDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.JOB_SEARCH_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_DELETE,
    payload
  }
}

export const jobSearchUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.JOB_SEARCH_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_UPDATE,
    payload
  }
}

export const jobSearchListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.JOB_SEARCH_H_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_LIST,
    payload
  }
}
export const jobSearchDublicateListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.JOB_SEARCH_LIST_REPETITION, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_LIST_REPETITION,
    payload
  }
}

export const jobSearchItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.JOB_SEARCH_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_ITEM,
    payload
  }
}

export const jobSearchJoinListFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.JOB_SEARCH_ITEM_REPETITION, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.JOB_SEARCH_ITEM_REPETITION,
    payload
  }
}
