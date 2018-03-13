import _ from 'lodash'
import React from 'react'
import SearchField from '../../Basic/SearchField'
import t from '../../../../helpers/translate'

const Items = [
    {id: 'beginner', name: t('Начальный')},
    {id: 'intermediate', name: t('Средний')},
    {id: 'advanced', name: t('Продвинутый')},
    {id: 'fluent', name: t('Свободное владение')}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const LanguageLevelSearchField = (props) => {
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

export default LanguageLevelSearchField
