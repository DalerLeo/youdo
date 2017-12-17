import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let clientCustomListToken = null

const getOptions = (search) => {
    if (clientCustomListToken) {
        clientCustomListToken.cancel()
    }
    clientCustomListToken = CancelToken.source()
    return axios().get(`${PATH.CLIENT_LIST}?search=${search || ''}&page_size=100`, {cancelToken: clientCustomListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CLIENT_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const ClientSearchFieldCustom = connect()((props) => {
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

export default ClientSearchFieldCustom
