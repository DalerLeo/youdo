import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/applicationSerializer'

const CancelToken = axios().CancelToken

export const applicationCreateAction = (formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .post(API.HR_APPLICATION_CREATE, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APPLICATION_CREATE,
    payload
  }
}

export const applicationDeleteAction = (id) => {
  const payload = axios()
    .delete(sprintf(API.HR_APPLICATION_DELETE, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APPLICATION_DELETE,
    payload
  }
}

export const applicationUpdateAction = (id, formValues) => {
  const requestData = serializers.createSerializer(formValues)
  const payload = axios()
    .put(sprintf(API.HR_APPLICATION_ITEM, id), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APPLICATION_UPDATE,
    payload
  }
}

export const applicationListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())
  const payload = axios()
    .get(API.HR_APPLICATION_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APPLICATION_LIST,
    payload
  }
}

export const applicationItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.HR_APPLICATION_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APPLICATION_ITEM,
    payload
  }
}

export const usersListFetchAction = () => {
  const params = serializers.usersListSerializer()
  const payload = axios()
    .get(API.USERS_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.USERS_LIST,
    payload
  }
}

export const privilegeListFetchAction = () => {
  const payload = axios()
    .get(API.HR_PRIVILEGE_LIST, {params: {page_size: 100}})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_PRIVILEGE_LIST,
    payload
  }
}

let applicationLogsToken = null
export const getApplicationLogs = (application) => {
  if (applicationLogsToken) {
    applicationLogsToken.cancel()
  }
  applicationLogsToken = CancelToken.source()
  const payload = axios()
    .get(API.HR_APP_LOGS_LIST, {params: {
      application,
      page_size: 20,
      ordering: 'created_date'
    },
    cancelToken: applicationLogsToken.token})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APP_LOGS_LIST,
    payload
  }
}

export const changeApplicationAction = (action, application, formValues) => {
  const requestData = action === 'sent_to_client'
    ? {
      action,
      application,
      email: _.get(formValues, 'email'),
      message: _.get(formValues, 'message')
    }
    : {
      action,
      application
    }
  const payload = axios()
    .post(API.HR_APP_CHANGE_ACTION, requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APP_CHANGE_ACTION,
    payload
  }
}

export const submitMeetingAction = (application, formValues, single, resume, meeting) => {
  const datetime = _.get(formValues, ['resumes', resume, 'datetime'])
  const requestData = serializers.applicationMeetingSerializer(application, formValues)
  const TYPE = single ? actionTypes.HR_APP_UPDATE_MEETING : actionTypes.HR_APP_CREATE_MEETING_MULTI
  const payload = single
    ? axios()
      .put(sprintf(API.HR_APP_UPDATE_MEETING, meeting), {
        is_approve: false,
        meeting_time: moment(datetime, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        application,
        resume
      })
      .then((response) => {
        return _.get(response, 'data')
      })
      .catch((error) => {
        return Promise.reject(_.get(error, ['response', 'data']))
      })

    : axios()
      .post(API.HR_APP_CREATE_MEETING_MULTI, requestData)
      .then((response) => {
        return _.get(response, 'data')
      })
      .catch((error) => {
        return Promise.reject(_.get(error, ['response', 'data']))
      })
  return {
    type: TYPE,
    payload
  }
}

export const getMeetingListAction = (application) => {
  const params = serializers.applicationMeetingListSerializer(application)
  const payload = axios()
    .get(API.HR_APP_GET_MEETING_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APP_GET_MEETING_LIST,
    payload
  }
}

export const confirmMeetingTime = (data, application) => {
  const payload = axios()
    .put(sprintf(API.HR_APP_UPDATE_MEETING, _.get(data, 'meetingId')), {
      application,
      resume: _.get(data, 'resumeId'),
      meeting_time: moment(_.get(data, 'meetingTime')).format('YYYY-MM-DD HH:mm'),
      is_approve: true
    })
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APP_GET_MEETING_LIST,
    payload
  }
}

export const confirmCompleteApplication = (application, formValues) => {
  const requestData = serializers.applicationCompleteSerializer(formValues)
  const payload = axios()
    .post(sprintf(API.HR_APP_COMPLETE, application), requestData)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.HR_APP_COMPLETE,
    payload
  }
}
