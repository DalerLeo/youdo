import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let productListToken = null

const getOptions = (search) => {
    if (productListToken) {
        productListToken.cancel()
    }
    productListToken = CancelToken.source()
    return axios().get(`${PATH.PRODUCT_LIST}?search=${search || ''}&page_size=100`, {cancelToken: productListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.PRODUCT_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const ProductSearchField = connect()((props) => {
    const {...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
})

export default ProductSearchField
