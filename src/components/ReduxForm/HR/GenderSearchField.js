import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import t from '../../../helpers/translate'

const SexSearchField = (props) => {
    const {removeNoMatter} = props

    const Items = [
        {id: 'no_matter', name: t('Не имеет значения')},
        {id: 'male', name: t('Мужской')},
        {id: 'female', name: t('Женский')}
    ]

    const getOptions = () => {
        const filteredItems = _.filter(Items, (item) => _.get(item, 'id') !== 'no_matter')
        return removeNoMatter ? Promise.resolve(filteredItems) : Promise.resolve(Items)
    }

    const getItem = (id) => {
        return Promise.resolve(
            _.find(Items, (o) => { return o.id === id }))
    }
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

export default SexSearchField
