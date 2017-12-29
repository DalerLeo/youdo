import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const Items = [
    {id: 'confirmed', name: 'Подтвержден'},
    {id: 'requested', name: 'Ожидает'},
    {id: 'rejected', name: 'Отменен'},
    {id: 'auto', name: 'Подтвержден автоматически'}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === id }))
}

const ClientTransactionStatusSearchField = (props) => {
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

export default ClientTransactionStatusSearchField
