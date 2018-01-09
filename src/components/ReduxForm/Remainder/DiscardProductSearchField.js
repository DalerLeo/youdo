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
import numberFormat from '../../../helpers/numberFormat'

const getOptions = (search, type, stock) => {
    return axios().get(`${PATH.REMAINDER_LIST}?type=${type || ''}&page_size=100&search=${search || ''}&stock=${stock || ''}`)
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

const DiscardProductSearchField = enhance((props) => {
    const {dispatch, state, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const type = _.get(state, ['form', 'RemainderDiscardForm', 'values', 'productType', 'value'])
    const stock = _.get(state, ['form', 'RemainderDiscardForm', 'values', 'fromStock', 'value'])
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
                        <div>Доступно: {available}</div>
                        <div>Браковано: {defects}</div>
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

export default DiscardProductSearchField
