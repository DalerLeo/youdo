import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.PRODUCT_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const ProductSearchField = connect()((props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PRODUCT_LIST, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
})

export default ProductSearchField
