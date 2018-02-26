import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.CONTENT_TYPE_SEARCH}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const getRussianText = (obj) => {
    const name = _.get(obj, 'name')
    return name === 'order return accept' ? t('Возврат')
            : (name === 'order transfer product' ? t('Заказ')
            : (name === 'stock transfer product' ? t('Передача')
            : (name === 'supply accept' ? t('Поставка') : name)))
}

const StockHistoryTypeSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getRussianText}
            getOptions={search => searchFieldGetOptions(PATH.CONTENT_TYPE_SEARCH, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={getRussianText}
            {...props}
        />
    )
}

export default StockHistoryTypeSearchField
