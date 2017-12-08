import React from 'react'
import MultiSelectField from './Basic/MultiSelectField'

const Items = [
    {id: 1, name: 'Каждый день'},
    {id: 2, name: 'Раз в неделю'},
    {id: 3, name: 'Два раза в неделю'},
    {id: 4, name: 'Иногда'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const FrequencySearchField = (props) => {
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

export default FrequencySearchField
