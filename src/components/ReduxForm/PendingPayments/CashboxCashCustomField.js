import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}`, {'params': {'type': 'cash'}})
        .then(({data}) => {
            const cashbox = _.get(data, 'results')
            return Promise.resolve(toCamelCase(cashbox))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxCashCustomField = (props) => {
    return (
        <SearchField
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => { return _.get(value, ['name']) }}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={(value) => { return _.get(value, ['name']) }}
            {...props}
        />
    )
}

export default CashboxCashCustomField
