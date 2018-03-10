import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

const ProviderMultiSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PROVIDER_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.PROVIDER_LIST)}
            getItemText={MultiSelectField.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
    )
}

export default ProviderMultiSearchField
