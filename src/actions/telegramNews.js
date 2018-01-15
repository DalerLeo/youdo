import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/telegramNewsSerializer'

export const telegramNewsCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.TELEGRAM_NEWS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TELEGRAM_NEWS_CREATE,
        payload
    }
}

export const telegramNewsDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.TELEGRAM_NEWS_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TELEGRAM_NEWS_DELETE,
        payload
    }
}

export const telegramNewsUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.TELEGRAM_NEWS_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TELEGRAM_NEWS_UPDATE,
        payload
    }
}

export const telegramNewsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.TELEGRAM_NEWS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TELEGRAM_NEWS_LIST,
        payload
    }
}

export const telegramNewsItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.TELEGRAM_NEWS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TELEGRAM_NEWS_ITEM,
        payload
    }
}