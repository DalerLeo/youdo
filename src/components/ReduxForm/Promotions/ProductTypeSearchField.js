import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchFieldCustom from '../Basic/ParentSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let productTypeListToken = null

const getOptions = (search) => {
    if (productTypeListToken) {
        productTypeListToken.cancel()
    }
    productTypeListToken = CancelToken.source()
    return axios().get(`${PATH.PRODUCT_TYPE_LIST}?page_size=100000&search=${search || ''}`, {cancelToken: productTypeListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        }).then((data) => {
            return {options: _.map(data, (item) => {
                return {
                    label: item.name,
                    value: item.id
                }
            })}
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
const ProductTypeSearchField = (props) => {
    return (
        <SearchFieldCustom
            getValue={SearchFieldCustom.defaultGetValue('id')}
            getText={SearchFieldCustom.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchFieldCustom.defaultGetText('name')}
            {...props}
        />
    )
}

export default ProductTypeSearchField
