import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const Items = [
    {id: 1, name: 'Поставка'},
    {id: 2, name: 'Передача'},
    {id: 3, name: 'Возврат'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
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
