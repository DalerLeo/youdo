import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import caughtCancel from '../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let deliveryManMultiListToken = null

const getOptions = (search) => {
    if (deliveryManMultiListToken) {
        deliveryManMultiListToken.cancel()
    }
    deliveryManMultiListToken = CancelToken.source()
    return axios().get(`${PATH.USERS_LIST}?search=${search || ''}&page_size=100&group=delivery`, {cancelToken: deliveryManMultiListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.USERS_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getText = (obj) => {
    return _.get(obj, 'firstName') + ' ' + _.get(obj, 'secondName')
}
const DeliveryManSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getText}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('secontName')}
            multi={true}
            {...props}
        />
    )
}

export default DeliveryManSearchField
