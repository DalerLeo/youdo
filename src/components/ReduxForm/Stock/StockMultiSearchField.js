import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const StockSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.STOCK_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.STOCK_LIST)}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default StockSearchField
