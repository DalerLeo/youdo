import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/positionSerializer'

export const courseCreateAction = (formValues, position) => {
    const requestData = serializers.courseSerializer(formValues, position)
    const payload = axios()
        .post(API.POSITION_COURSE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_COURSE_CREATE,
        payload
    }
}

export const positionCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.POSITION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_CREATE,
        payload
    }
}

export const positionDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.POSITION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_DELETE,
        payload
    }
}

export const positionUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.POSITION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_UPDATE,
        payload
    }
}

export const positionListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.POSITION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.POSITION_LIST,
        payload
    }
}

export const positionItemFetchAction = (filter, id) => {
    const payload = axios()
        .get(sprintf(API.POSITION_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_ITEM,
        payload
    }
}

export const positionPermissionListFetchAction = (filter) => {
    const payload = axios()
        .get(API.POSITION_PERMISSION)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.POSITION_PERMISSION,
        payload
    }
}
