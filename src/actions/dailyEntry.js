import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/dailyEntrySerializer'

export const dailyEntryCreateAction = (formValues) => {
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.DAILY_ENTRY_CREATE, data)
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DAILY_ENTRY_CREATE,
        payload
    }
}

export const dailyEntryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.DAILY_ENTRY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DAILY_ENTRY_LIST,
        payload
    }
}

export const dailyEntryItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.DAILY_ENTRY_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DAILY_ENTRY_LIST,
        payload
    }
}
