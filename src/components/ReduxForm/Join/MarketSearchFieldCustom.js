import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import {compose} from 'recompose'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const setShopItemAction = (data, loading) => {
    return {
        type: actionTypes.SHOP_EXTRA,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch) => {
    dispatch(setShopItemAction(null, true))
    return axios().get(sprintf(PATH.SHOP_ITEM, id))
        .then(({data}) => {
            dispatch(setShopItemAction(data, false))
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

const MarketSearchFieldCustom = enhance((props) => {
    const {dispatch, params, pageSize, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.SHOP_LIST, search, params, pageSize)}
            getItem={test}
            getItemText={SearchField.defaultGetText('name')}
            {...defaultProps}
            withDetails={true}
        />
    )
})

export default MarketSearchFieldCustom
