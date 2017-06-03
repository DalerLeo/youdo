import _ from 'lodash'
import React from 'react'
import SearchField from './SearchField'

const Items = [
    {id: 0, name: 'Запрос отправлен'},
    {id: 1, name: 'Готов'},
    {id: 2, name: 'Доставлен'},
    {id: 3, name: 'Отменен'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const CurrencySearchField = (props) => {
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

export default CurrencySearchField
