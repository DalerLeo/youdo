import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import t from '../../../helpers/translate'

const getOptions = (search, options) => {
    return Promise.resolve(options)
}

const getItem = (id, items) => {
    return Promise.resolve(
        _.find(items, (o) => { return o.id === id }))
}

const TransactionIncomeCategory = (props) => {
    const items = [
        {id: 'client', name: t('Приход на счет клиента')},
        {id: 'provider', name: t('Приход с поставшика')}
    ]
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => getOptions(search, items)}
            getItem={id => getItem(id, items)}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default TransactionIncomeCategory
