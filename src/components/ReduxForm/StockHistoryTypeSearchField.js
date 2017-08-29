import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const Items = [
    {id: 1, name: 'Поставка'},
    {id: 2, name: 'Передача'},
    {id: 3, name: 'По заказу'},
    {id: 4, name: 'Возврат'},
    {id: 5, name: 'Cписание'},
    {id: 6, name: 'Отсрочка доставки'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const StockHistoryTypeSearchField = (props) => {
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

export default StockHistoryTypeSearchField
