import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const Items = [
    {id: 'orders', name: 'Заказ'},
    {id: 'transfers', name: 'Передача'}
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
