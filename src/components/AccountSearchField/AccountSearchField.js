import React from 'react'
import SearchField from '../SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'

const getOptions = (value) => {
    return axios().get(`${PATH.ACCOUNT_SEARCH}?search=${value}`)
        .then(({data}) => {
            return Promise.resolve(data.results)
        })
}

const AccountSearchField = (props) => {
    return (
        <SearchField
            getId={SearchField.defaultGetId('id')}
            getText={SearchField.defaultGetText('number')}
            getOptions={getOptions}
            input={props}
        />
    )
}

export default AccountSearchField
