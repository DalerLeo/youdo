import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import t from '../../../helpers/translate'

const Items = [
    {value: 'debtor', name: t('Долг поставщику')},
    {value: 'loaner', name: t('Долг поставщика')}
]
const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.value === id }))
}

const ProviderBalanceTypeSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('value')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default ProviderBalanceTypeSearchField
