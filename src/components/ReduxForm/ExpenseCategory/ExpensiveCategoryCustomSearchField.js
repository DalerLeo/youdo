import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let categoryExpensiveListToken = null

const getOptions = (search, keyname) => {
    const keyName = keyname === 'supply_expense' ? 'supply_expanse' : keyname
    if (categoryExpensiveListToken) {
        categoryExpensiveListToken.cancel()
    }
    categoryExpensiveListToken = CancelToken.source()
    return axios().get(PATH.EXPENSIVE_CATEGORY_LIST,
        {params: {search: search, page_size: 100, key_name: keyName}},
        {cancelToken: categoryExpensiveListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (item) => {
    const ID = _.isObject(item) ? _.get(item, 'id') : item
    return axios().get(sprintf(PATH.EXPENSIVE_CATEGORY_ITEM, ID))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
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

const ProductCustomSearchField = enhance((props) => {
    const {dispatch, ...defaultProps} = props
    const keyname = _.get(props, 'data-key-name')
    const test = (id) => {
        return getItem(id, dispatch)
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
                return getOptions(search, keyname)
            }}
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
