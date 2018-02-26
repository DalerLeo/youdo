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
    return axios().get(sprintf(PATH.INCOME_CATEGORY_ITEM, ID))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const TransactionIncomeCategory = (props) => {
    const {params, pageSize, ...defaultProps} = props
    const test = (id) => {
        return getItem(id)
    }
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
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            {...defaultProps}
        />
    )
}

export default TransactionIncomeCategory
