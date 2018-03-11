import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const SupplyMultiSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('id')}
            getOptions={search => searchFieldGetOptions(PATH.SUPPLY_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.SUPPLY_LIST)}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default SupplyMultiSearchField
