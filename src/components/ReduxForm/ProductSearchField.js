import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import SearchField from './SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import * as actionTypes from '../../constants/actionTypes'
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
    return axios().get(sprintf(PATH.PRODUCT_ITEM, id))
        .then(({data}) => {
            dispatch(setMeasurementAction(_.get(data, ['measurement', 'name']), false))
            return Promise.resolve(toCamelCase(data))
        })
}

const ProductSearchField = connect()((props) => {
    const {dispatch, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={test}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
})

export default ProductSearchField
