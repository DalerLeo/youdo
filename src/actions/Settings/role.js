import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Settings/roleSerializer'

export const courseCreateAction = (formValues, role) => {
  const requestData = serializers.courseSerializer(formValues, role)
  const payload = axios()
    .post(API.ROLE_COURSE_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_COURSE_CREATE,
    payload
  }
}

export const roleCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.ROLE_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_CREATE,
    payload
  }
}

export const roleDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.ROLE_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_DELETE,
    payload
  }
}

export const roleUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.ROLE_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_UPDATE,
    payload
  }
}

export const roleListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.ROLE_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })
  return {
    type: actionTypes.ROLE_LIST,
    payload
  }
}

export const roleItemFetchAction = (filter, id) => {
  const payload = axios()
    .get(sprintf(API.ROLE_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_ITEM,
    payload
  }
}

export const rolePermissionListFetchAction = () => {
  const payload = axios()
    .get(API.ROLE_PERMISSION, {params: {page_size: 100}})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ROLE_PERMISSION,
    payload
  }
}
