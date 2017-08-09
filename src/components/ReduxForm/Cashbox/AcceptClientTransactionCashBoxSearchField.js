import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search, currency) => {
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}`, {params: {currency}})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const custom = (currency) => {
    return (search) => {
        return getOptions(search, currency)
    }
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const AcceptClientTransactionCashBoxSearchField = (props) => {
    const {currency} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(currency)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default AcceptClientTransactionCashBoxSearchField
