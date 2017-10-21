import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'

const Items = [
    {id: 2, name: 'Принято'},
    {id: 1, name: 'Ожидает'},
    {id: 3, name: 'Отменен'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const SupplyTypeSearchFiled = (props) => {
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

export default SupplyTypeSearchFiled
