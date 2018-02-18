import sprintf from 'sprintf'
import React from 'react'
import _ from 'lodash'
import SearchField from '../Basic/ChildSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let marketTypeListToken = null

const getOptions = (search, parentType) => {
    if (marketTypeListToken) {
        marketTypeListToken.cancel()
    }
    marketTypeListToken = CancelToken.source()
    return axios().get(`${PATH.MARKET_TYPE_LIST}?search=${search || ''}&page_size=100`, {'params': {'parent': parentType}, cancelToken: marketTypeListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.MARKET_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const custom = (parentType) => {
    return (search) => {
        return getOptions(search, parentType)
    }
}

const MarketTypeSearchField = (props) => {
    const parentType = _.get(props, 'parentType')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(parentType)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            parent={parentType}
            {...props}
        />
    )
}

export default MarketTypeSearchField
