import _ from 'lodash'
import React from 'react'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let measurementListToken = null

const getOptions = (search) => {
    if (measurementListToken) {
        measurementListToken.cancel()
    }
    measurementListToken = CancelToken.source()
    return axios().get(`${PATH.MEASUREMENT_LIST}?search=${search || ''}&parent=0&page_size=100`, {cancelToken: measurementListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (value) => {
    const id = _.isObject(value) ? _.get(value, 'id') : value
    return axios().get(PATH.MEASUREMENT_H_LIST, {params: {ids: id}})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(_.first(data)))
        })
}

const MeasurementAllValuesSearchField = (props) => {
    return (
        <SearchFieldCustom
            getValue={(value) => _.get(value, 'id')}
            getText={(value) => _.get(value, 'name')}
            getOptions={getOptions}
            getItem={(value) => getItem(value)}
            getItemText={(value) => _.get(value, 'name')}
            autoFetch={true}
            {...props}
        />
    )
}

export default MeasurementAllValuesSearchField
