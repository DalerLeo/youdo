import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Settings/companyTypeSerializer'

export const companyTypeCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.COMPANY_TYPE_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMPANY_TYPE_CREATE,
    payload
  }
}

export const companyTypeDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.COMPANY_TYPE_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })
  return {
    type: actionTypes.COMPANY_TYPE_DELETE,
    payload
  }
}

export const companyTypeUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.COMPANY_TYPE_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMPANY_TYPE_UPDATE,
    payload
  }
}

export const companyTypeListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.COMPANY_TYPE_H_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMPANY_TYPE_H_LIST,
    payload
  }
}

export const companyTypeItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.COMPANY_TYPE_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMPANY_TYPE_ITEM,
    payload
  }
}
