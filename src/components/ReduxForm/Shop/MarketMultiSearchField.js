import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken

let shopListToken = null
const getOptions = (search) => {
    if (shopListToken) {
        shopListToken.cancel()
    }
    shopListToken = CancelToken.source()
    return axios().get(`${PATH.SHOP_LIST}?search=${search || ''}&page_size=100`, {cancelToken: shopListToken})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.SHOP_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const MarketSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default MarketSearchField
