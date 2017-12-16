import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let marketTypeListToken = null

const getOptions = (search) => {
    if (marketTypeListToken) {
        marketTypeListToken.cancel()
    }
    marketTypeListToken = CancelToken.source()
    return axios().get(`${PATH.MARKET_TYPE_LIST}?search=${search || ''}&page_size=100`, {cancelToken: marketTypeListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.MARKET_TYPE_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const MarketTypeMultiSearchField = (props) => {
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...props}
        />
    )
}

export default MarketTypeMultiSearchField
