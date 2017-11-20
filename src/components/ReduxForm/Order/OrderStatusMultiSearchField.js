import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/MultiSelectField'

const Items = [
    {id: 5, name: 'Запрос отправлен'},
    {id: 1, name: 'Есть на складе'},
    {id: 2, name: 'Передан доставщику'},
    {id: 3, name: 'Доставлен'},
    {id: 4, name: 'Отменен'}

]
const getOptions = () => {
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
