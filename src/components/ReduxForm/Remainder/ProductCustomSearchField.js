import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let customProductListToken = null

const getOptions = (search, type, stock) => {
    if (customProductListToken) {
        customProductListToken.cancel()
    }
    customProductListToken = CancelToken.source()
    return axios().get(`${PATH.REMAINDER_LIST}?type=${type || ''}&page_size=1000&stock=${stock || ''}&search=${search || ''}`, {cancelToken: customProductListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const setMeasurementAction = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_MEASUREMENT,
        data: data,
        loading: loading
    }
}

const getItem = (obj, dispatch) => {
    const productID = _.isObject(obj) ? _.get(obj, 'id') : obj
    dispatch(setMeasurementAction(null, true))
    return axios().get(sprintf(PATH.PRODUCT_ITEM, productID))
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
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const stock = _.get(state, ['form', 'RemainderTransferForm', 'values', 'fromStock', 'value'])
    const type = _.get(state, ['form', 'RemainderTransferForm', 'values', 'productType', 'value'])
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                const name = _.get(value, ['title'])
                const measurement = _.get(value, ['measurement', 'name'])
                const available = numberFormat(_.toNumber(_.get(value, 'available')), measurement)
                const defects = numberFormat(_.toNumber(_.get(value, 'defects')), measurement)
                return (
                    <div>
                        <div><strong>{name}</strong></div>
                        <div>{t('Доступно')}: {available}</div>
                        <div>{t('Браковано')}: {defects}</div>
                    </div>
                )
            }}
            getOptions={ (search) => { return getOptions(search, type, stock) }}
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['title'])
            }}
            parent={type}
            stock={stock}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
