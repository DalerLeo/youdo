import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import t from '../../../helpers/translate'

const Items = [
    {id: 'user', name: t('Пользователь')},
    {id: 'confident_user', name: t('Уверенный пользователь')},
    {id: 'advanced_user', name: t('Продвинутый пользователь')},
    {id: 'professional_level', name: t('Профессиональный уровень')}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const ComputerLevelSearchField = (props) => {
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

export default ComputerLevelSearchField
