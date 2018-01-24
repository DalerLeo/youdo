import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let categoryExpensiveListToken = null

const getOptions = (search, keyname) => {
    if (categoryExpensiveListToken) {
        categoryExpensiveListToken.cancel()
    }
    categoryExpensiveListToken = CancelToken.source()
    return axios().get(PATH.INCOME_CATEGORY_LIST,
        {params: {search: search, page_size: 100, key_name: keyname}},
        {cancelToken: categoryExpensiveListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.INCOME_CATEGORY_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')

        return {
            state,
            dispatch
        }
    })
)

const TransactionIncomeCategoryMultiSearch = enhance((props) => {
    const {...defaultProps} = props
    const keyname = _.get(props, 'data-key-name')
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, 'name')
            }}
            getOptions={(search) => {
                return getOptions(search, keyname)
            }}
            getIdsOption={getIdsOption}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            {...defaultProps}
        />
    )
})

export default TransactionIncomeCategoryMultiSearch