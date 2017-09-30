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

const getOptions = (search, type) => {
    return axios().get(`${PATH.PRODUCT_FOR_SELECT_LIST}?type=${type || ''}&page_size=1000&search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const setExtraData = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_EXTRA,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch, market) => {
    dispatch(setExtraData(null, true))
    return axios().get(sprintf(PATH.PRODUCT_MOBILE_ITEM, id), {'params': {'market': market}})
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
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, ['name'])
            }}
            getOptions={ (search) => { return getOptions(search, type) }}
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            parent={type}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
