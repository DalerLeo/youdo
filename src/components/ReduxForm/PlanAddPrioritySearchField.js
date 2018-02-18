import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'

const ONE = 1
const HUNDRED = 100

const Items = _.map(_.range(ONE, HUNDRED + ONE), (item) => {
    return {
        id: item,
        name: item
    }
})

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
