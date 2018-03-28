import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/longListSerializer'

// CREATE LONG, INTERVIEW, SHORT LISTS

export const addToLongList = (application, formValues) => {
    const requestData = serializers.createLongSerializer(formValues)
    const payload = axios()
        .post(sprintf(API.HR_LONG_LIST_CREATE, application), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_LONG_LIST_CREATE,
        payload
    }
}
export const addToInterviewList = (application, resume, formValues) => {
    const requestData = serializers.createMeetingSerializer(formValues)
    const payload = axios()
        .post(sprintf(API.HR_LONG_LIST_CREATE, application), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_LONG_LIST_CREATE,
        payload
    }
}

//

export const getApplicationDetails = (id) => {
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

export const getResumePreviewList = (filter) => {
    const params = serializers.resumePreviewFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.HR_RESUME_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_PREVIEW_LIST,
        payload
    }
}

export const getLongList = (filter, appId, appStatus) => {
    const params = serializers.resumeListFilterSerializer(filter.getParams(), appId, appStatus)
    const payload = axios()
        .get(API.HR_RESUME_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_LONG_LIST,
        payload
    }
}

export const getInterviewList = (filter, appId, appStatus) => {
    const params = serializers.resumeListFilterSerializer(filter.getParams(), appId, appStatus)
    const payload = axios()
        .get(API.HR_RESUME_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_INTERVIEW_LIST,
        payload
    }
}

export const getShortList = (filter, appId, appStatus) => {
    const params = serializers.resumeListFilterSerializer(filter.getParams(), appId, appStatus)
    const payload = axios()
        .get(API.HR_RESUME_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_SHORT_LIST,
        payload
    }
}
