import _ from 'lodash'
import React from 'react'
import SearchFieldCustom from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.INCOME_CATEGORY_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const TransactionIncomeCategoryMultiSearch = (props) => {
    const {params, pageSize, ...defaultProps} = props
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, 'name')
            }}
            getOptions={(search) => {
                return searchFieldGetOptions(PATH.INCOME_CATEGORY_LIST, search, params, pageSize)
            }}
            getIdsOption={getIdsOption}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            {...defaultProps}
        />
    )
}

export default TransactionIncomeCategoryMultiSearch
