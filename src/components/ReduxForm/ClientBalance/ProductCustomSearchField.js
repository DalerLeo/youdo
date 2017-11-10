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

const getOptions = (search, type, market, priceList) => {
    return axios().get(`${PATH.RETURN_CREATE_PRODUCTS_LIST}?type=${type || ''}&market=${market || ''}&price_list=${priceList || ''}&page_size=100&search=${search || ''}`)
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

const getItem = (id, dispatch, market, priceList) => {
    dispatch(setMeasurementAction(null, true))
    return axios().get(sprintf(PATH.RETURN_CREATE_PRODUCTS_ITEM, id), {params: {market: market, price_list: priceList}})
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
    const {dispatch, state, ...defaultProps} = props
    const type = _.get(state, ['form', 'ReturnCreateForm', 'values', 'type', 'value'])
    const market = _.get(state, ['form', 'ReturnCreateForm', 'values', 'market', 'value'])
    const priceList = _.get(state, ['form', 'ReturnCreateForm', 'values', 'priceList', 'value'])
    const test = (id) => {
        return getItem(id, dispatch, market, priceList)
    }
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                const name = _.get(value, 'name')
                const sales = _.toInteger(_.get(value, 'sales'))
                return (
                    <div>{name} <strong>Продажи {sales}</strong></div>
                )
            }}
            getOptions={ (search) => { return getOptions(search, type, market, priceList) }}
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
