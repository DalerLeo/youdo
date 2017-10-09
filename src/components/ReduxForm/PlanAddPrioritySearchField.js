import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const ONE = 1
const HUNDRED = 100

let Items = []
for (let i = ONE; i <= HUNDRED; i++) {
    const obj = {id: i, name: i}
    Items.push(obj)
}

const getOptions = () => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const PlanAddPrioritySearchField = (props) => {
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

export default PlanAddPrioritySearchField
