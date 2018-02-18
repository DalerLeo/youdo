import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let cashboxListToken = null

const getOptions = (search, type) => {
    if (cashboxListToken) {
        cashboxListToken.cancel()
    }
    cashboxListToken = CancelToken.source()
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}&page_size=100&type=${type}`, {cancelToken: cashboxListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (value) => {
    const id = _.isObject(value) ? _.get(value, 'id') : value
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxSearchField = (props) => {
    const paymentType = _.get(props, 'data-payment-type')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={(search) => {
                return getOptions(search, paymentType)
            }}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default CashboxSearchField
