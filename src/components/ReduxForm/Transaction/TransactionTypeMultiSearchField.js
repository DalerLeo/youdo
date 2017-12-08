import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import {
    ORDER,
    INCOME_FROM_AGENT,
    formattedType,
    INCOME,
    OUTCOME_FOR_SUPPLY_EXPANSE,
    OUTCOME,
    OUTCOME_FROM_CLIENT,
    TO_TRANSFER,
    FROM_TRANSFER,
    INCOME_TO_CLIENT
} from '../../../constants/transactionTypes'

const Items = [
    {id: FROM_TRANSFER, name: formattedType[FROM_TRANSFER]},
    {id: TO_TRANSFER, name: formattedType[TO_TRANSFER]},
    {id: ORDER, name: formattedType[ORDER]},
    {id: INCOME, name: formattedType[INCOME]},
    {id: OUTCOME, name: formattedType[OUTCOME]},
    {id: INCOME_TO_CLIENT, name: formattedType[INCOME_TO_CLIENT]},
    {id: OUTCOME_FROM_CLIENT, name: formattedType[OUTCOME_FROM_CLIENT]},
    {id: INCOME_FROM_AGENT, name: formattedType[INCOME_FROM_AGENT]},
    {id: OUTCOME_FOR_SUPPLY_EXPANSE, name: formattedType[OUTCOME_FOR_SUPPLY_EXPANSE]}
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
