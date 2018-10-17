
import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/projectSerializer'
import moment from 'moment'
export const projectCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.PROJECT_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PROJECT_CREATE,
    payload
  }
}

export const projectDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.PROJECT_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PROJECT_DELETE,
    payload
  }
}

export const projectUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.PROJECT_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PROJECT_UPDATE,
    payload
  }
}

export const projectListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.PROJECT_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PROJECT_LIST,
    payload
  }
}

export const projectItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.PROJECT_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.PROJECT_ITEM,
    payload
  }
}
export const taskCreateAction = (id, formValues) => {
  const params = {
    ...formValues,
    deadline: _.get(formValues, 'deadline') && moment(_.get(formValues, 'deadline')).format('YYYY-MM-DD')
  }
  const payload = axios()
    .post(sprintf(API.TASK_CREATE, Number(id)), params)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.TASK_CREATE,
    payload
  }
}

export const taskDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.TASK_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.TASK_DELETE,
    payload
  }
}

export const taskUpdateAction = (pId, taskId, formValues) => {
  const params = {
    ...formValues,
    deadline: _.get(formValues, 'deadline') && moment(_.get(formValues, 'deadline')).format('YYYY-MM-DD')
  }

  const payload = axios()
    .put(sprintf(API.TASK_UPDATE, pId, taskId), params)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.TASK_UPDATE,
    payload
  }
}

export const taskListFetchAction = (id, filter) => {
  const params = {ordering: filter.getParam('ordering')}
  const payload = axios()
    .get(sprintf(API.TASK_LIST, Number(id)), {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.TASK_LIST,
    payload
  }
}

export const taskListClear = () => {
  return {
    type: `${actionTypes.TASK_LIST}_CLEAR`
  }
}

export const taskItemFetchAction = (pId, id) => {
  const payload = axios()
    .get(sprintf(API.TASK_ITEM, Number(pId), Number(id)))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.TASK_ITEM,
    payload
  }
}

export const commentListFetchAction = (pId, id) => {
  const payload = axios()
    .get(sprintf(API.COMMENT_LIST, Number(pId), Number(id)))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMMENT_LIST,
    payload
  }
}

export const commentCreateAction = (pId, id, formValues) => {
  const params = {
    comment: _.get(formValues, 'comment'),
    file: _.get(formValues, 'file')
  }
  const payload = axios()
    .post(sprintf(API.COMMENT_CREATE, Number(pId), Number(id)), params)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.COMMENT_CREATE,
    payload
  }
}
