import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../../components/ReduxForm/Basic/SearchFieldCustom'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search, currency, paymentType) => {
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}&page_size=100&type=${paymentType}&currency=${currency}`)
        .then(({data}) => {
            const cashbox = _.get(data, 'results')
            return Promise.resolve(toCamelCase(cashbox))
        })
}

const custom = (paymentType, currency) => {
    return (search) => {
        return getOptions(search, currency, paymentType)
    }
}
const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxTypeCurrencyField = (props) => {
    const paymentType = _.get(props, 'paymentType')
    const currency = _.get(props, 'currency')
    return (
        <SearchField
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => { return _.get(value, ['name']) }}
            getOptions={custom(paymentType, currency)}
            getItem={getItem}
            getItemText={(value) => { return _.get(value, ['name']) }}
            {...props}
        />
    )
}

export default CashboxTypeCurrencyField
