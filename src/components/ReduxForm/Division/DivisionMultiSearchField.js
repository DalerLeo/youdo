import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let divisionMultiListToken = null

const getOptions = (search) => {
    if (divisionMultiListToken) {
        divisionMultiListToken.cancel()
    }
    divisionMultiListToken = CancelToken.source()
    return axios().get(`${PATH.DIVISION_LIST}?search=${search || ''}&page_size=100`, {cancelToken: divisionMultiListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.DIVISION_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const DivisionMultiSearchField = (props) => {
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
}

export default DivisionMultiSearchField
