import React from 'react'
import Form from '../Form'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'

const getOptions = (value) => {
    return axios().get(`${PATH.ACCOUNT_SEARCH}?search=${value}`)
        .then(({data}) => {
            return Promise.resolve(data.results)
        })
}

const AccountSearchField = ({input, ...rest}) => {
    return (
        <Form.SearchField
            id="id"
            title="number"
            placeholder={rest.placeholder}
            getOptions={getOptions}
            {...input}
        />
    )
}

export default AccountSearchField
