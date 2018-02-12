import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import caughtCancel from '../../helpers/caughtCancel'
import t from '../../helpers/translate'

const CancelToken = axios().CancelToken
let usersAgentListToken = null

const getOptions = (search) => {
    if (usersAgentListToken) {
        usersAgentListToken.cancel()
    }
    usersAgentListToken = CancelToken.source()
    return axios().get(`${PATH.CONTENT_TYPE_SEARCH}?search=${search || ''}&page_size=100`, {cancelToken: usersAgentListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
        .catch((error) => {
            caughtCancel(error)
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
    return name === 'order return accept' ? t('Возврат')
            : (name === 'order transfer product' ? t('Заказ')
            : (name === 'stock transfer product' ? t('Передача')
            : (name === 'supply accept' ? t('Поставка') : name)))
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
