import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.CONTENT_TYPE_SEARCH}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.CONTENT_TYPE_SEARCH}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const getRussianText = (obj) => {
    const name = _.get(obj, 'name')
    return name === 'order return accept' ? 'Возврат'
            : (name === 'order transfer product' ? 'Заказ'
            : (name === 'stock transfer product' ? 'Передача'
            : (name === 'supply accept' ? 'Поставка' : name)))
}

const StockHistoryTypeSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getRussianText}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={getRussianText}
            {...props}
        />
    )
}

export default StockHistoryTypeSearchField
