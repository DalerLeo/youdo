import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let supplyListToken = null

const getOptions = (search) => {
    if (supplyListToken) {
        supplyListToken.cancel()
    }
    supplyListToken = CancelToken.source()
    return axios().get(`${PATH.SUPPLY_LIST}?search=${search || ''}&page_size=100`, {cancelToken: supplyListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.SUPPLY_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const SupplyMultiSearchField = (props) => {
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('id')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...props}
        />
    )
}

export default SupplyMultiSearchField