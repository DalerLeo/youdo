import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/planSerializer'

export const planCreateAction = (formValues, query, comboChosenAgent) => {
    const requestData = serializers.createSerializer(formValues, query, comboChosenAgent)
    const payload = axios()
        .post(API.PLAN_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_CREATE_SUBMIT,
        payload
    }
}

export const planUpdateAction = (formValues, query, id) => {
    const requestData = serializers.createSerializer(formValues, query)
    const payload = axios()
        .put(sprintf(API.PLAN_UPDATE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_UPDATE_SUBMIT,
        payload
    }
}

export const planComboAction = (formValues, query, id) => {
    const requestData = serializers.comboSerializer(formValues, query)
    const payload = axios()
        .put(sprintf(API.PLAN_UPDATE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_UPDATE_SUBMIT,
        payload
    }
}

export const planDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PLAN_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        payload
    }
}

export const planUpdateDialogAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PLAN_UPDATE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_UPDATE,
        payload
    }
}

export const planMonthlySetAction = (data, filter, user) => {
    const requestData = serializers.monthlyPlanSerializer(data, filter.getParams(), user)
    const payload = axios()
        .post(API.PLAN_MONTHLY, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_MONTHLY,
        payload
    }
}

export const planAgentsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PLAN_AGENT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_AGENT_LIST,
        payload
    }
}

export const planItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.USERS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.USERS_ITEM,
        payload
    }
}

export const agentMonthlyPlanAction = (filter, user) => {
    const params = serializers.agentMonthlyPlanSerializer(filter.getParams(), user)
    const payload = axios()
        .get(API.PLAN_AGENT_MONTHLY, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_AGENT_MONTHLY,
        payload
    }
}

export const planZonesListFetchAction = () => {
    const payload = axios()
        .get(API.ZONE_LIST, {params: {without_plan: 1}})
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

export const planZoneItemFetchAction = (id) => {
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

export const planZonesItemFetchAction = (id, date) => {
    const payload = axios()
        .get(API.PLAN_AGENTS, {params: {border: id, date: date}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_AGENTS,
        payload
    }
}

export const marketsLocationAction = (zone) => {
    const payload = axios()
        .get(API.MARKETS_LOCATION, {params: {border: zone, with_plan: true}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKETS_LOCATION,
        payload
    }
}

export const planCombinationAction = (market) => {
    const payload = axios()
        .get(API.PLAN_COMBINATION, {params: {market: market}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_COMBINATION,
        payload
    }
}

export const agentPlansAction = (agent, date) => {
    const payload = axios()
        .get(sprintf(API.PLAN_AGENTS_ITEM, agent), {params: {date: date}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_AGENTS_ITEM,
        payload
    }
}

