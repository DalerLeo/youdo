import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'

const Items = [
    {id: 1, name: 'Задолжники'},
    {id: 2, name: 'Закладчики'}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const ClientBalanceTypeSearchField = (props) => {
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

export default ClientBalanceTypeSearchField
