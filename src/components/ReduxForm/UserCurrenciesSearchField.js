import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const currencies = _.get(state, ['authConfirm', 'data', 'currencies'])
        return {
            currencies
        }
    })
)

const UserCurrenciesSearchField = enhance((props) => {
    const {currencies} = props

    const getOptions = () => {
        return Promise.resolve(currencies)
    }

    const getItem = (id) => {
        return Promise.resolve(
            _.find(currencies, (o) => { return o.id === _.toInteger(id) })
        )
    }
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
})

export default UserCurrenciesSearchField
