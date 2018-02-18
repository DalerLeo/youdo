import React from 'react'
import SearchField from '../Basic/MultiSelectField'

const Items = [
    {id: 0, name: 'Ожидает'},
    {id: 1, name: 'В процессе'},
    {id: 2, name: 'Принят'},
    {id: 4, name: 'Отменен'}
]

const getOptions = () => {
    return Promise.resolve(Items)
}
const SupplyTypeMultiSearchField = (props) => {
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

export default SupplyTypeMultiSearchField
