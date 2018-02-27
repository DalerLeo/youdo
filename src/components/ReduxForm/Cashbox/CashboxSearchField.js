import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (value) => {
    const id = _.isObject(value) ? _.get(value, 'id') : value
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const CashboxSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.CASHBOX_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default CashboxSearchField
