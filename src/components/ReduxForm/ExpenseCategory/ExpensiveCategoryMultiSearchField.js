import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const ExpensiveCategoryMultiSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.EXPENSIVE_CATEGORY_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.EXPENSIVE_CATEGORY_LIST)}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default ExpensiveCategoryMultiSearchField
