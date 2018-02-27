import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.PROVIDER_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const ProviderMultiSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PROVIDER_LIST, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={MultiSelectField.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
    )
}

export default ProviderMultiSearchField
