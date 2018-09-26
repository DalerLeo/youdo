import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/Settings/skillsSerializer'

export const skillsCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.SKILLS_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SKILLS_CREATE,
    payload
  }
}

export const skillsDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.SKILLS_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SKILLS_DELETE,
    payload
  }
}

export const skillsUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.SKILLS_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SKILLS_UPDATE,
    payload
  }
}

export const skillsListFetchAction = (filter) => {
  const params = filter
    ? serializers.listFilterSerializer(filter.getParams())
    : {}
  const payload = axios()
    .get(API.SKILLS_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SKILLS_LIST,
    payload
  }
}

export const skillsItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.SKILLS_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.SKILLS_ITEM,
    payload
  }
}
