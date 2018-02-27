import sprintf from 'sprintf'
import React from 'react'
import ParentSearchField from '../Basic/ParentSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const OrderProductTypeSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <ParentSearchField
            getValue={ParentSearchField.defaultGetValue('id')}
            getText={ParentSearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PRODUCT_TYPE_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={ParentSearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default OrderProductTypeSearchField
