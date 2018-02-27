import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

import {connect} from 'react-redux'

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
    const {dispatch, params, pageSize, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.PRODUCT_LIST, search, params, pageSize)}
            getItem={test}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
        />
    )
})

export default ProductSearchField
