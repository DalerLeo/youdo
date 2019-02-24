import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../../helpers/axios'
import * as API from '../../../constants/api'
import * as actionTypes from '../../../constants/actionTypes'
import * as serializers from './customerSerializer'

export const customerCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.CUSTOMER_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.CUSTOMER_CREATE,
    payload
  }
}

export const customerDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.CUSTOMER_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.CUSTOMER_DELETE,
    payload
  }
}

export const customerUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .patch(sprintf(API.CUSTOMER_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.CUSTOMER_UPDATE,
    payload
  }
}

export const customerListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.CUSTOMER_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.CUSTOMER_LIST,
    payload
  }
}
export const spheresFetchAction = () => {
  const payload = axios()
    .get(API.SPECIALITY_LIST, {params: {pageSize: '10000'}})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SPHERES_LIST,
    payload
  }
}

export const customerItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.CUSTOMER_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.CUSTOMER_ITEM,
    payload
  }
}
