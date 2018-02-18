import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/SearchField'
import {
    ORDER,
    INCOME_FROM_AGENT,
    formattedType,
    INCOME,
    OUTCOME_FOR_SUPPLY_EXPENSE,
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
    {id: OUTCOME_FOR_SUPPLY_EXPENSE, name: formattedType[OUTCOME_FOR_SUPPLY_EXPENSE]}
]

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const TransactionTypeSearchField = (props) => {
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

export default TransactionTypeSearchField
