import _ from 'lodash'
import React from 'react'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import sprintf from 'sprintf'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (item) => {
    const ID = _.isObject(item) ? _.get(item, 'id') : item
    return axios().get(sprintf(PATH.EXPENSIVE_CATEGORY_ITEM, ID))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const ExpensiveCategoryCustomSearchField = (props) => {
    const {params, pageSize, ...defaultProps} = props
    const test = (id) => {
        return getItem(id)
    }
    return (
        <SearchFieldCustom
            getValue={value => _.get(value, 'id')}
            getText={value => _.get(value, 'name')}
            getOptions={search => searchFieldGetOptions(PATH.EXPENSIVE_CATEGORY_LIST, search, params, pageSize)}
            getItem={test}
            getItemText={value => _.get(value, ['name'])}
            {...defaultProps}
        />
    )
}

export default ExpensiveCategoryCustomSearchField
