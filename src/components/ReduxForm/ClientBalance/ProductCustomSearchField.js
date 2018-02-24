import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import getConfig from '../../../helpers/getConfig'
import toBoolean from '../../../helpers/toBoolean'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'

const configMarkets = toBoolean(getConfig('MARKETS_MODULE'))

const setMeasurementAction = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_MEASUREMENT,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch, market, priceList, currency) => {
    dispatch(setMeasurementAction(null, true))
    return axios().get(sprintf(PATH.RETURN_CREATE_PRODUCTS_ITEM, id), {params: {market: market, price_list: priceList, currency: currency}})
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
    const client = _.get(state, ['form', 'ReturnCreateForm', 'values', 'client', 'value'])
    const priceList = _.get(state, ['form', 'ReturnCreateForm', 'values', 'priceList', 'value'])
    const currency = _.get(state, ['form', 'ReturnCreateForm', 'values', 'currency', 'value'])
    const params = {
        type,
        market,
        client: !configMarkets ? client : null,
        priceList,
        currency
    }
    const test = (id) => {
        return getItem(id, dispatch, market, priceList, currency)
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
            getOptions={ (search) => { return searchFieldGetOptions(PATH.RETURN_CREATE_PRODUCTS_LIST, search, params) }}
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
