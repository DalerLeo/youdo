import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.SHOP_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.SHOP_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const MarketSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default MarketSearchField
