import React from 'react'
import SearchField from './Basic/MultiSelectField'

const Items = [
    {id: 0, name: 'В ожидании'},
    {id: 1, name: 'В ходе выполнения'},
    {id: 2, name: 'Завершено'},
    {id: 3, name: 'Отменен'}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const ReturnStatusSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getIdsOption={getOptions}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default ReturnStatusSearchField
