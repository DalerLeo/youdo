import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const ProductMultiSearchField = connect()((props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PRODUCT_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.PRODUCT_LIST)}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
})

export default ProductMultiSearchField
