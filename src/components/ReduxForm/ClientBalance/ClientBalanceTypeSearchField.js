import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'

const Items = [
    {value: 'debtor', name: 'Задолжники'},
    {value: 'loaner', name: 'Закладчики'}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.value === id }))
}

const ClientBalanceTypeSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('value')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default ClientBalanceTypeSearchField
