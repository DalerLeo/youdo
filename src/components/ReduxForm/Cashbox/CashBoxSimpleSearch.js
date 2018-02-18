import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let cashboxSimpleListToken = null

const getOptions = (search) => {
    if (cashboxSimpleListToken) {
        cashboxSimpleListToken.cancel()
    }
    cashboxSimpleListToken = CancelToken.source()
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}&page_size=100`, {cancelToken: cashboxSimpleListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const CashboxSearchField = (props) => {
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

export default CashboxSearchField
