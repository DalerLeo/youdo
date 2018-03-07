import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'
const pageSize = 1000

const setMeasurementAction = (data, loading) => {
    return {
        type: actionTypes.SHOP_ITEM,
        data: data,
        loading: loading
    }
}

const getItem = (obj, dispatch) => {
    const productID = _.isObject(obj) ? _.get(obj, 'id') : obj
    dispatch(setMeasurementAction(null, true))
    return axios().get(sprintf(PATH.PRODUCT_ITEM, productID))
        .then(({data}) => {
            dispatch(setMeasurementAction(data, false))
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
    const {dispatch, state, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const type = _.get(state, ['form', 'SupplyCreateForm', 'values', 'type', 'value'])
    const params = {type}
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, ['name'])
            }}
            getOptions={ (search) => searchFieldGetOptions(PATH.PRODUCT_FOR_SELECT_LIST, search, params, pageSize)}
            getItem={test}
            parent={type}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
