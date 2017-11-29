import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search, currency, type) => {
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}&page_size=100`, {'params': {'type': type, 'currency': currency}})
        .then(({data}) => {
            const cashbox = _.get(data, 'results')
            return Promise.resolve(toCamelCase(cashbox))
        })
}


const custom = (manufacture) => {
    return (search) => {
        return getOptions(search, manufacture)
    }
}
const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxTypeCurrencyField = (props) => {
    const type = _.get(props, 'type')
    const currency = _.get(props, 'currency')
    return (
        <SearchField
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => { return _.get(value, ['name']) }}
            getOptions={custom(type, currency)}
            getItem={getItem}
            getItemText={(value) => { return _.get(value, ['name']) }}
            {...props}
        />
    )
}

export default CashboxTypeCurrencyField
