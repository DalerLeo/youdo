import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/zoneSerializer'

export const zoneCreateAction = (title, points) => {
    const requestData = serializers.createSerializer(title, points)
    const payload = axios()
        .post(API.ZONE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ZONE_CREATE,
        payload
    }
}

export const zoneUpdateAction = (id, title, points) => {
    const requestData = serializers.updateSerializer(title, points)
    const payload = axios()
        .put(sprintf(API.ZONE_UPDATE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ZONE_UPDATE,
        payload
    }
}

export const zoneDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.ZONE_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ZONE_DELETE,
        payload
    }
}

export const zoneListFetchAction = () => {
    const payload = axios()
        .get(API.ZONE_LIST)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_LIST,
        payload
    }
}

export const zoneItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ZONE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_ITEM,
        payload
    }
}

export const zoneListSearchFetchAction = (search) => {
    const payload = axios()
        .get(API.ZONE_LIST, {params: {'search': search}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_LIST,
        payload
    }
}

export const zoneStatisticsFetchAction = () => {
    const payload = axios()
        .get(API.ZONE_STAT)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_STAT,
        payload
    }
}

export const zoneBindAgentAction = (id, formValues) => {
    const requestData = serializers.bindAgentSerializer(formValues)
    const payload = axios()
        .post(sprintf(API.ZONE_BIND_AGENT, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_BIND_AGENT,
        payload
    }
}

export const zoneUnbindAgentAction = (detailId, agentId) => {
    const payload = axios()
        .post(sprintf(API.ZONE_UNBIND_AGENT, detailId), {'user_id': agentId})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ZONE_BIND_AGENT,
        payload
    }
}

export const zoneCustomCreateAction = (title, points) => {
    const requestData = serializers.createCustomSerializer(title, points)
    const payload = axios()
        .post(API.ZONE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ZONE_CREATE,
        payload
    }
}

export const zoneCustomUpdateAction = (id, title, points) => {
    const requestData = serializers.updateCustomSerializer(title, points)
    const payload = axios()
        .put(sprintf(API.ZONE_UPDATE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ZONE_UPDATE,
        payload
    }
}
