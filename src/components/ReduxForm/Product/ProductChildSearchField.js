import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search, parentType) => {
    return axios().get(`${PATH.PRODUCT_LIST}?search=${search || ''}`, {'params': {'parent': parentType}})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}
const custom = (parentType) => {
    return (search) => {
        return getOptions(search, parentType)
    }
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const ProductChildSearchField = (props) => {
    const parentType = _.get(props, 'parentType')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(parentType)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default ProductChildSearchField
