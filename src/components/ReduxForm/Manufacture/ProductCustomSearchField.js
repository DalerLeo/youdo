import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const setExtraData = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_EXTRA,
        data: data,
        loading: loading
    }
}

const getItem = (obj, dispatch) => {
    const productID = _.isObject(obj) ? _.get(obj, 'id') : obj
    dispatch(setExtraData(null, true))
    return axios().get(sprintf(PATH.PRODUCT_ITEM, productID))
        .then(({data}) => {
            dispatch(setExtraData(data, false))
            return Promise.resolve(toCamelCase(data))
        })
}

const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')
        const market = _.get(state, ['form', 'OrderCreateForm', 'values', 'market', 'value'])
        return {
            state,
            dispatch,
            market
        }
    })
)

const ProductCustomSearchField = enhance((props) => {
    const {dispatch, state, market, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch, market)
    }
    const type = _.get(state, ['form', 'OrderCreateForm', 'values', 'type', 'value'])
    const params = {type}
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, ['name'])
            }}
            getOptions={ (search) => {
                return searchFieldGetOptions(PATH.PRODUCT_FOR_SELECT_LIST, search, params)
            }}
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            type={type}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
