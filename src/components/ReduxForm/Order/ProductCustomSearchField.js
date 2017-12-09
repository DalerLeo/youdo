import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import numberFormat from '../../../helpers/numberFormat'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'

const ZERO = 0
const getOptions = (search, type, priceList, currency) => {
    return axios().get(`${PATH.PRODUCT_FOR_ORDER_SELECT_LIST}?price_list=${priceList || ''}&currency=${currency || ''}&type=${type || ''}&page_size=100&search=${search || ''}`)
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

const getItem = (id, dispatch, priceList, currency) => {
    dispatch(setExtraData(null, true))
    return axios().get(PATH.PRODUCT_MOBILE_ITEM, {params: {price_list: priceList, products: id, currency: currency}})
        .then(({data}) => {
            const obj = _.get(data, ['results', ZERO])
            dispatch(setExtraData(obj, false))
            return Promise.resolve(toCamelCase(obj))
        })
}

const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')
        const priceList = _.get(state, ['form', 'OrderCreateForm', 'values', 'priceList', 'value'])
        const currency = _.get(state, ['form', 'OrderCreateForm', 'values', 'currency', 'value'])

        return {
            state,
            dispatch,
            priceList,
            currency
        }
    })
)

const ProductCustomSearchField = enhance((props) => {
    const {dispatch, state, priceList, currency, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch, priceList, currency)
    }
    const type = _.get(state, ['form', 'OrderCreateForm', 'values', 'type', 'value'])
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                const balance = _.get(value, 'balance')
                const measurement = _.get(value, ['measurement', 'name'])
                const name = _.get(value, 'name')
                return (
                    <div>{name} <strong>({numberFormat(balance, measurement)})</strong></div>
                )
            }}
            getOptions={ (search) => { return getOptions(search, type, priceList, currency) }}
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
