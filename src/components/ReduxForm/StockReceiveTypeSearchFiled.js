import React from 'react'
import SearchField from './Basic/SearchField'
import _ from 'lodash'
import t from '../../helpers/translate'

const Items = [
    {id: 'supplies', name: t('Поставка')},
    {id: 'transfers', name: t('Передача')},
    {id: 'returns', name: t('Возврат')},
    {id: 'delivery_returns', name: t('Отсроченные доставки')}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === id }))
}

const OrderTransferTypeSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default OrderTransferTypeSearchField
