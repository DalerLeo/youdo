import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const ShiftMultiSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props

    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.SHIFT_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.SHIFT_LIST)}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default ShiftMultiSearchField
