import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/applicationSerializer'

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

export const getApplicationLogs = (application) => {
    const payload = axios()
        .get(API.HR_APP_LOGS_LIST, {params: {
            page_size: 20,
            application,
            ordering: 'created_date'
        }})
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
