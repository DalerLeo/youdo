import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/longListSerializer'
import {HR_RESUME_MEETING, HR_RESUME_SHORT} from '../../constants/backendConstants'

// CREATE LONG, INTERVIEW, SHORT LISTS && DELETE

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
    const requestData = serializers.createMoveToSerializer(application, resume, HR_RESUME_MEETING, formValues)
    const payload = axios()
        .post(API.HR_RESUME_MOVE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_MOVE,
        payload
    }
}
export const addToShortList = (application, resume, formValues) => {
    const requestData = serializers.createMoveToSerializer(application, resume, HR_RESUME_SHORT, formValues)
    const payload = axios()
        .post(API.HR_RESUME_MOVE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_MOVE,
        payload
    }
}
export const deleteResume = (application, resume, formValues) => {
    const requestData = serializers.removeResumeSerializer(resume, formValues)
    const payload = axios()
        .post(sprintf(API.HR_RESUME_REMOVE, application), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_REMOVE,
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

export const formShortList = (application) => {
    const payload = axios()
        .post(sprintf(API.HR_FORM_SHORT_LIST, application))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_FORM_SHORT_LIST,
        payload
    }
}

export const addResumeComment = (resume, formValues) => {
    const requestData = serializers.createCommentSerializer(resume, formValues)
    const payload = axios()
        .post(API.HR_RESUME_COMMENT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_COMMENT_CREATE,
        payload
    }
}

export const getResumeComments = (filter) => {
    const params = serializers.resumeCommentsSerializer(filter.getParams())
    const payload = axios()
        .get(API.HR_RESUME_COMMENT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_COMMENT_LIST,
        payload
    }
}
