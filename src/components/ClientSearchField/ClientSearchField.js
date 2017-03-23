import React from 'react'
import SearchField from '../SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'

const getOptions = (value) => {
    return axios().get(`${PATH.CLIENT_LIST}?search=${value}`)
        .then(({data}) => {
            return Promise.resolve(data.results)
        })
}

const ClientSearchField = (props) => {
    return (
        <SearchField
            getId={SearchField.defaultGetId('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            input={props}
        />
    )
}

export default ClientSearchField
