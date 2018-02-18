import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/ChildSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let productyTypeChildListToken = null

const getOptions = (search, parentType) => {
    if (productyTypeChildListToken) {
        productyTypeChildListToken.cancel()
    }
    productyTypeChildListToken = CancelToken.source()
    return axios().get(`${PATH.PRODUCT_TYPE_LIST}?search=${search || ''}&page_size=100&parent=${parentType}`, {cancelToken: productyTypeChildListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const ProductTypeChildSearchField = (props) => {
    const parentType = _.get(props, 'parentType')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={(search) => getOptions(search, parentType)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            parent={parentType}
            {...props}
        />
    )
}

export default ProductTypeChildSearchField
