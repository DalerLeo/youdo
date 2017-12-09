import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'

const Items = [
    {id: 'basic', name: 'Основной'},
    {id: 'manufacturing', name: 'Производственный'}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === id }))
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
