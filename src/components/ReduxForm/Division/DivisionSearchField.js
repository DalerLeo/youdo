import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let divisionListToken = null

const getOptions = (search) => {
    if (divisionListToken) {
        divisionListToken.cancel()
    }
    divisionListToken = CancelToken.source()

    return axios().get(`${PATH.DIVISION_LIST}?search=${search || ''}&page_size=100`, {cancelToken: divisionListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.DIVISION_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const DivisionSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default DivisionSearchField
