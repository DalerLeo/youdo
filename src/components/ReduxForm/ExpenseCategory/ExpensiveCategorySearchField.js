import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let expensiveCategoryListToken = null

const getOptions = (search) => {
    if (expensiveCategoryListToken) {
        expensiveCategoryListToken.cancel()
    }
    expensiveCategoryListToken = CancelToken.source()
    return axios().get(`${PATH.EXPENSIVE_CATEGORY_LIST}?search=${search || ''}&page_size=100`, {cancelToken: expensiveCategoryListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.EXPENSIVE_CATEGORY_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const ExpensiveCategorySearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default ExpensiveCategorySearchField
