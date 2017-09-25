import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import {
    PAYMENT,
    CANCEL,
    ORDER_RETURN,
    CANCEL_ORDER,
    CANCEL_ORDER_RETURN,
    EXPENSE,
    FIRST_BALANCE,
    ORDER,
    NONE_TYPE,
    formattedType
} from '../../constants/clientBalanceInfo'

const Items = [
    {id: PAYMENT, name: formattedType[PAYMENT]},
    {id: CANCEL, name: formattedType[CANCEL]},
    {id: ORDER, name: formattedType[ORDER]},
    {id: ORDER_RETURN, name: formattedType[ORDER_RETURN]},
    {id: CANCEL, name: formattedType[CANCEL]},
    {id: CANCEL_ORDER, name: formattedType[CANCEL_ORDER]},
    {id: CANCEL_ORDER_RETURN, name: formattedType[CANCEL_ORDER_RETURN]},
    {id: EXPENSE, name: formattedType[EXPENSE]},
    {id: FIRST_BALANCE, name: formattedType[FIRST_BALANCE]},
    {id: NONE_TYPE, name: formattedType[NONE_TYPE]}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const ClientTransactionTypeSearchField = (props) => {
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

export default ClientTransactionTypeSearchField
