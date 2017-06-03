import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import * as actionTypes from '../../constants/actionTypes'
import {connect} from 'react-redux'

const getOptions = (search) => {
    return axios().get(`${PATH.PROVIDER_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

export const setItemAction = (data, loading) => {
    return {
        type: actionTypes.PROVIDER_CONTACTS,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch) => {
    dispatch(setItemAction(null, true))

    return axios().get(sprintf(PATH.PROVIDER_ITEM, id))
        .then(({data}) => {
            dispatch(setItemAction(_.get(data, 'contacts'), false))
            return Promise.resolve(toCamelCase(data))
        })
}

const ProviderSearchField = connect()((props) => {
    const {dispatch} = props
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
            {...props}
        />
    )
})

export default ProviderSearchField
