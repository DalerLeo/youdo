import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'
import t from '../../../helpers/translate'

const CancelToken = axios().CancelToken
let orderListToken = null

const getOptions = (search) => {
    if (orderListToken) {
        orderListToken.cancel()
    }
    orderListToken = CancelToken.source()
    return axios().get(`${PATH.ORDER_LIST}?search=${search || ''}&page_size=100`, {cancelToken: orderListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(PATH.ORDER_LIST)
        .then(({data}) => {
            const detail = _.find(data, {'id': id})
            return Promise.resolve(toCamelCase(detail))
        })
}

const OrderSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={(value) => {
                const id = _.get(value, 'id')
                const client = _.get(value, ['client', 'name'])
                const contract = _.get(value, 'contract') || '-'
                return (
                    <div>
                        <div>{t('Заказ №')}{id}</div>
                        <div>{t('Клиент')}: {client}</div>
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

export default OrderSearchField