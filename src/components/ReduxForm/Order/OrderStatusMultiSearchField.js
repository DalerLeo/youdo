import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'

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

const CurrencySearchField = (props) => {
    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getOptions}
            getItemText={MultiSelectField.defaultGetText('name')}
            {...props}
        />
    )
}

export default CurrencySearchField
