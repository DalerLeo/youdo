import React from 'react'
import SearchField from '../SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'

const getOptions = (value) => {
    return axios().get(`${PATH.FUND_MANAGER_LIST}?search=${value}`)
        .then(({data}) => {
            return Promise.resolve(data.results)
        })
}

const FundManagerSearchField = (props) => {
    return (
        <SearchField
            getId={SearchField.defaultGetId('id')}
            getText={SearchField.defaultGetText('first_name')}
            getOptions={getOptions}
            input={props}
        />
    )
}

export default FundManagerSearchField
