import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Administration/applicantSerializer'

export const applicantCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.APPLICANT_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.APPLICANT_CREATE,
    payload
  }
}

export const applicantDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.APPLICANT_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.APPLICANT_DELETE,
    payload
  }
}

export const applicantUpdateAction = (id, formValues) => {
  const requestData = serializers.updateSerializer(formValues)
  const payload = axios()
    .patch(sprintf(API.APPLICANT_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.APPLICANT_UPDATE,
    payload
  }
}

export const applicantListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.APPLICANT_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.APPLICANT_LIST,
    payload
  }
}

export const applicantItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.APPLICANT_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.APPLICANT_ITEM,
    payload
  }
}