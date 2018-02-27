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

const setMeasurementAction = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_MEASUREMENT,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch) => {
    dispatch(setMeasurementAction(null, true))
    return axios().get(sprintf(PATH.PRODUCT_ITEM, _.get(id, 'id')))
        .then(({data}) => {
            dispatch(setMeasurementAction(_.get(data, ['measurement', 'name']), false))
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
    const {dispatch, state, pageSize, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const type = _.get(state, ['form', 'PricesCreateForm', 'values', 'type', 'value'])
    const params = {type}
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return value
            }}
            getText={(value) => {
                return _.get(value, ['name'])
            }}
            getOptions={ (search) => { return searchFieldGetOptions(PATH.PRODUCT_LIST, search, params, pageSize) }}
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
