import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'
import * as actionTypes from '../../constants/actionTypes'
import * as serializers from '../../serializers/HR/applicationSerializer'

export const tasksListFetchAction = (filter) => {
    const defaultOrderirng = 'deadline'
    const params = serializers.listFilterSerializer(filter.getParams(), defaultOrderirng)
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

export const tasksItemFetchAction = (id) => {
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
