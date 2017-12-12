import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken

let clientListToken = null
const getOptions = (search) => {
    if (clientListToken) {
        clientListToken.cancel('Daler')
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
const getIdsOption = (ids) => {
    return axios().get(`${PATH.CLIENT_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const ClientSearchField = connect()((props) => {
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...props}
        />
    )
})

export default ClientSearchField
