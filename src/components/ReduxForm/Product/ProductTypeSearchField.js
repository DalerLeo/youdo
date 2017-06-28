import sprintf from 'sprintf'
import React from 'react'
import {withState} from 'recompose'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

// withState('productTypeId', 'setProductTypeId', null)

const getOptions = (search) => {
    return axios().get(`${PATH.PRODUCT_TYPE_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
        console.log('aslkdm')
            withState({'productTypeId': id})
            console.log('set state')
            return Promise.resolve(toCamelCase(data))
        })
}
const ProductTypeSearchField = (props) => {
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

export default ProductTypeSearchField
