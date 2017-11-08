import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.PRICELIST_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRICELIST_LIST, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const PriceListSearchField = (props) => {
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

export default PriceListSearchField
