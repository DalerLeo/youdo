import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'

const getOptions = (search, ikkinchi) => {
    return axios().get(`${PATH.PRODUCT_LIST}?ikkinchi=${ikkinchi || ''}&search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const setExtraAction = (data, loading) => {
    return {
        type: actionTypes.PRODUCT_EXTRA,
        data: data,
        loading: loading
    }
}

const FIRST_ITEM = 0
const getItem = (id, dispatch) => {
    dispatch(setExtraAction(null, true))
    return axios().post(PATH.PRODUCT_EXTRA, {'products': [id]})
        .then(({data}) => {
            dispatch(setExtraAction(_.get(data, FIRST_ITEM), false))
            return Promise.resolve(toCamelCase(_.get(data, [FIRST_ITEM, 'product'])))
        })
}
const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')

        return {
            dispatch,
            state
        }
    })
)
const OrderProductSearchField = enhance((props) => {
    const {dispatch, state} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const type = _.get(state, ['form', 'OrderCreateForm', 'values', 'type', 'value'])
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={(search) => { return getOptions(search, type) }}
            getItem={test}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
})

export default OrderProductSearchField
