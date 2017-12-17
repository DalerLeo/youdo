import React from 'react'
import SearchField from '../Basic/MultiSelectField'
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
} from '../../../constants/clientBalanceInfo'

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

const ClientTransactionTypeMultiSearchField = (props) => {
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

export default ClientTransactionTypeMultiSearchField