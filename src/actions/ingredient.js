import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/ingredientSerializer'

export const ingredientCreateAction = (formValues, id, manufacture) => {
    const requestData = serializers.createSerializer(formValues, id, manufacture)
    const payload = axios()
        .post(API.INGREDIENT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INGREDIENT_CREATE,
        payload
    }
}

export const ingredientDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.INGREDIENT_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.INGREDIENT_DELETE,
        payload
    }
}

export const ingredientUpdateAction = (formValues, id, productId) => {
    const requestData = serializers.updateSerializer(formValues, productId)
    const payload = axios()
        .put(sprintf(API.INGREDIENT_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INGREDIENT_UPDATE,
        payload
    }
}

export const ingredientListFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.INGREDIENT_LIST, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INGREDIENT_LIST,
        payload
    }
}
