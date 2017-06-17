import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'

const getOptions = (search) => {
    return axios().get(`${PATH.PRODUCT_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

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

const ProductCustomSearchField = connect()((props) => {
    const {dispatch, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    return (
        <SearchField
            getValue={(value) => { return value }}
            getText={(value) => { return _.get(value, ['name']) }}
            getOptions={getOptions}
            getItem={test}
            getItemText={(value) => { return _.get(value, ['name']) }}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
