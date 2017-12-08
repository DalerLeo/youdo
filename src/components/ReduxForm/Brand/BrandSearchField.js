import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.BRAND_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.BRAND_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const BrandSearchField = (props) => {
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

export default BrandSearchField
