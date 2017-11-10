import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const priceLists = _.get(state, ['authConfirm', 'data', 'priceLists'])
        return {
            priceLists
        }
    })
)

const PriceListSearchField = enhance((props) => {
    const priceLists = _.get(props, 'priceLists')

    const getOptions = () => {
        return Promise.resolve(priceLists)
    }

    const getItem = (id) => {
        return Promise.resolve(
            _.find(priceLists, (o) => { return o.id === _.toInteger(id) })
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

export default PriceListSearchField
