import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.SUPPLY_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const SupplyMultiSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('id')}
            getOptions={search => searchFieldGetOptions(PATH.SUPPLY_LIST, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default SupplyMultiSearchField
