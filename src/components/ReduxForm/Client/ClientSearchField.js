import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let clientListToken = null

const getOptions = (search) => {
    if (clientListToken) {
        clientListToken.cancel()
    }
    clientListToken = CancelToken.source()
    return axios().get(`${PATH.CLIENT_LIST}?search=${search || ''}&page_size=100`, {cancelToken: clientListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const setItemAction = (data, loading) => {
    return {
        type: actionTypes.CLIENT_CONTACTS,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch) => {
    dispatch(setItemAction(null, true))

    return axios().get(sprintf(PATH.CLIENT_ITEM, id))
        .then(({data}) => {
            dispatch(setItemAction(_.get(data, 'contacts'), false))
            return Promise.resolve(toCamelCase(data))
        })
}

const ClientSearchField = connect()((props) => {
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

export default ClientSearchField
