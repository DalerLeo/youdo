import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const Items = [
    {id: 0, name: 'В ожидании'},
    {id: 1, name: 'В ходе выполнения'},
    {id: 2, name: 'Завершено'},
    {id: 3, name: 'Отменен'}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const ReturnStatusSearchField = (props) => {
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

export default ReturnStatusSearchField
