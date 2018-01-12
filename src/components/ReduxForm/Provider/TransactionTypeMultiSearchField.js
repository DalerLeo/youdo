import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import {
    formattedType,
    FIRST_BALANCE,
    SUPPLY_EXPENSE,
    INCOME_FROM_PROVIDER,
    NONE_TYPE,
    PAYMENT,
    SUPPLY
} from '../../../constants/providerTransactions'

const Items = [
    {id: FIRST_BALANCE, name: formattedType[FIRST_BALANCE]},
    {id: SUPPLY_EXPENSE, name: formattedType[SUPPLY_EXPENSE]},
    {id: INCOME_FROM_PROVIDER, name: formattedType[INCOME_FROM_PROVIDER]},
    {id: NONE_TYPE, name: formattedType[NONE_TYPE]},
    {id: PAYMENT, name: formattedType[PAYMENT]},
    {id: SUPPLY, name: formattedType[SUPPLY]}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const TransactionTypeMultiSearchField = (props) => {
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

export default TransactionTypeMultiSearchField
