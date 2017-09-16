import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search, clientId) => {
    return axios().get(`${PATH.SHOP_LIST}?search=${search || ''}`, {'params': {'client': clientId}})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
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
        />
    )
}

export default MarketSearchField
