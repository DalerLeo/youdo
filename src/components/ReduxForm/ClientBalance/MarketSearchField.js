import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let marketListToken = null

const getOptions = (search, clientId) => {
    if (marketListToken) {
        marketListToken.cancel()
    }
    marketListToken = CancelToken.source()
    return axios().get(`${PATH.SHOP_LIST}?search=${search || ''}&page_size=100`, {'params': {'client': clientId}, cancelToken: marketListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const custom = (clientId) => {
    return (search) => {
        return getOptions(search, clientId)
    }
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.SHOP_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const MarketSearchField = (props) => {
    const clientId = _.get(props, 'clientId')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(clientId)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
            parent={clientId}
        />
    )
}

export default MarketSearchField
