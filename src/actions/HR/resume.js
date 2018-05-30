import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/resumeSerializer'

export const resumeCreateAction = (forms) => {
  const requestData = serializers.createSerializer(forms)
  const payload = axios()
    .post(API.HR_RESUME_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_RESUME_CREATE,
    payload
  }
}

export const resumeDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.HR_RESUME_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_RESUME_DELETE,
    payload
  }
}

export const resumeUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.HR_RESUME_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_RESUME_UPDATE,
    payload
  }
}

export const resumeChangeStatusAction = (resume, status) => {
  const payload = axios()
    .post(API.HR_RESUME_UPDATE_STATUS, {
      resume,
      status
    })
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: '',
    payload
  }
}

export const resumeListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.HR_RESUME_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_RESUME_LIST,
    payload
  }
}

export const resumeItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.HR_RESUME_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_RESUME_ITEM,
    payload
  }
}
