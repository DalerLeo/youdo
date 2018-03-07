import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.SHOP_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const MarketSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.SHOP_LIST, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
}

export default MarketSearchField
