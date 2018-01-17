import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'
import t from '../../../helpers/translate'

const CancelToken = axios().CancelToken
let supplyListToken = null

const getOptions = (search) => {
    if (supplyListToken) {
        supplyListToken.cancel()
    }
    supplyListToken = CancelToken.source()
    return axios().get(`${PATH.SUPPLY_LIST}?search=${search || ''}&page_size=100`, {cancelToken: supplyListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(PATH.SUPPLY_LIST)
        .then(({data}) => {
            const detail = _.find(data, {'id': id})
            return Promise.resolve(toCamelCase(detail))
        })
}

const SupplySearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={(value) => {
                const id = _.get(value, 'id')
                const provider = _.get(value, ['provider', 'name'])
                const contract = _.get(value, 'contract') || '-'
                return (
                    <div>
                        <div>{t('Поставка №')}{id}</div>
                        <div>{t('Поставщик')}: {provider}</div>
                        <div>{t('Номер договора')}: {contract}</div>
                    </div>
                )
            }}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default SupplySearchField
