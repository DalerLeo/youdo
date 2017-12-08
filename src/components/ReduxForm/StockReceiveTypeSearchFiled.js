import React from 'react'
import SearchField from './Basic/MultiSelectField'

const Items = [
    {id: 'supplies', name: 'Поставка'},
    {id: 'transfers', name: 'Передача'},
    {id: 'returns', name: 'Возврат'},
    {id: 'delivery_returns', name: 'Отсроченные доставки'}
]

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const OrderTransferTypeSearchField = (props) => {
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

export default OrderTransferTypeSearchField
