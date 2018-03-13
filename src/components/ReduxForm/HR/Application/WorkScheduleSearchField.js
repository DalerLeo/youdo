import _ from 'lodash'
import React from 'react'
import SearchField from '../../Basic/SearchField'
import t from '../../../../helpers/translate'

const Items = [
    {id: 'full_time', name: t('Полный рабочий день')},
    {id: 'shift_work', name: t('Сменный график')},
    {id: 'remote', name: t('Удаленно')},
    {id: 'part_time', name: t('Частичная занятость')}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const WorkScheduleSearchField = (props) => {
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

export default WorkScheduleSearchField
