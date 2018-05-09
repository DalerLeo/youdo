import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/longListSerializer'
import {HR_RESUME_NOTE} from '../../constants/backendConstants'

// CREATE LONG, INTERVIEW, SHORT LISTS, REPORT LIST, DELETE && COMPLETE INTERVIEW

export const addToLongList = (application, formValues) => {
    const requestData = serializers.createLongSerializer(application, formValues)
    const payload = axios()
        .post(API.HR_LONG_LIST_CREATE, requestData)
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
export const addReportList = (application, resumes) => {
    const requestData = serializers.createReportSerializer(application, resumes)
    const payload = axios()
        .post(API.HR_REPORT_LIST_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_REPORT_LIST_CREATE,
        payload
    }
}
export const addToShortList = (application, resumes) => {
    const requestData = serializers.createShortSerializer(application, resumes)
    const payload = axios()
        .post(API.HR_SHORT_LIST_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_SHORT_LIST_CREATE,
        payload
    }
}
export const changeResumeStatus = (application, resume, formValues, filter, datetime) => {
    const status = filter.getParam('moveTo')
    const currentStatus = filter.getParam('status')
    const statusToChange = status === HR_RESUME_NOTE ? currentStatus : status
    const requestData = serializers.createMoveToSerializer(application, resume, datetime, statusToChange, currentStatus, formValues)
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
export const deleteResume = (application, resume, formValues, filter, relation) => {
    const status = filter.getParam('moveTo')
    const currentStatus = filter.getParam('status')
    const statusToChange = status === HR_RESUME_NOTE ? currentStatus : status
    const requestData = serializers.createMoveToSerializer(application, resume, statusToChange, currentStatus, formValues)
    const payload = axios()
        .delete(sprintf(API.HR_RESUME_REMOVE, relation), requestData)
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

export const getReportList = (filter, appId, appStatus) => {
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
        type: actionTypes.HR_REPORT_LIST,
        payload
    }
}

export const formShortList = (application) => {
    const payload = axios()
        .post(API.HR_FORM_REPORT_LIST, {application, action: 'report_sent_to_manager'})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_FORM_REPORT_LIST,
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

export const resumeAddNote = (application, resume, value, status, {date, time}) => {
    const requestData = serializers.createNoteSerializer(application, resume, value, status, {date, time})
    const payload = axios()
        .post(API.HR_RESUME_NOTE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_NOTE_CREATE,
        payload
    }
}

export const createQuestions = (application, formValues) => {
    const requestData = serializers.createQuestionsSerializer(application, formValues)
    const payload = axios()
        .post(API.HR_APPLICATION_QUESTIONS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_APPLICATION_QUESTIONS_CREATE,
        payload
    }
}

export const getQuestionsList = (application) => {
    const params = serializers.questionsListSerializer(application)
    const payload = axios()
        .get(API.HR_APPLICATION_QUESTIONS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_APPLICATION_QUESTIONS_LIST,
        payload
    }
}

export const sendResumeAnswers = (application, resume, formData) => {
    const requestData = serializers.sendAnswersSerializer(application, resume, formData)
    const payload = axios()
        .post(API.HR_RESUME_ANSWERS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_ANSWERS_CREATE,
        payload
    }
}

export const getResumeAnswersList = (application, resume) => {
    const params = serializers.answersListSerializer(application, resume)
    const payload = axios()
        .get(API.HR_RESUME_ANSWERS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_ANSWERS_LIST,
        payload
    }
}

export const getResumeLogsList = (resume) => {
    const payload = axios()
        .get(sprintf(API.HR_RESUME_ITEM_LOGS, resume))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_RESUME_ITEM_LOGS,
        payload
    }
}

export const updateReportList = (application, reportIds, shortIds) => {
    const requestData = serializers.updateReportSerializer(application, reportIds, shortIds)
    const payload = axios()
        .post(API.HR_UPDATE_REPORT_LIST, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_UPDATE_REPORT_LIST,
        payload
    }
}

export const resumeUpdateAction = (id, formValues) => {
    const requestData = serializers.updateResumeSerializer(formValues)
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

export const finishMeetingAction = (request) => {
    const payload = axios()
        .post(API.HR_RESUME_MOVE, request)
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
export const getAppStatAction = (application) => {
    const payload = axios()
        .get(sprintf(API.HR_APPLICATION_ITEM_STAT, application))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_APPLICATION_ITEM_STAT,
        payload
    }
}

export const getRequiredCommentsAction = (relationId) => {
    const payload = axios()
        .get(API.HR_FEEDBACK_LIST, {params: {
            application_resume: relationId,
            page_size: 50
        }})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_FEEDBACK_LIST,
        payload
    }
}

export const sendRequiredCommentsAction = (data) => {
    const payload = axios()
        .post(API.HR_FEEDBACK_CREATE, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.HR_FEEDBACK_CREATE,
        payload
    }
}
