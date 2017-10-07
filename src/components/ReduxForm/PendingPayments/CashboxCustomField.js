import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.CASHBOX_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            const cashbox = _.get(data, 'results')
            return Promise.resolve(toCamelCase(cashbox))
        })
}

const getItem = (value) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, _.get(value, 'id')))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxCustomField = (props) => {
    return (
        <SearchField
            getValue={(value) => {
                return value
            }}
            getText={(value) => { return _.get(value, ['name']) }}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={(value) => { return _.get(value, ['name']) }}
            {...props}
        />
    )
}

export default CashboxCustomField
