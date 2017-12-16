import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import caughtCancel from '../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let agentListToken = null

const getOptions = (search) => {
    if (agentListToken) {
        agentListToken.cancel()
    }
    agentListToken = CancelToken.source()
    return axios().get(`${PATH.USERS_LIST}?search=${search || ''}&page_size=100`, {cancelToken: agentListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.USERS_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const AgentSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('username')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={SearchField.defaultGetText('username')}
            {...props}
        />
    )
}

export default AgentSearchField
