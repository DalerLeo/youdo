import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/SearchField'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const priceLists = _.get(state, ['authConfirm', 'data', 'priceLists'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        return {
            priceLists,
            isSuperUser
        }
    })
)

const PriceListSearchField = enhance((props) => {
    const {priceLists, isSuperUser} = props
    const newPricelist = isSuperUser ? _.union(priceLists, [{name: 'Себестоимость', id: -1}]) : priceLists

    const getOptions = () => {
        return Promise.resolve(newPricelist)
    }

    const getItem = (id) => {
        return Promise.resolve(
            _.find(newPricelist, (o) => { return o.id === _.toInteger(id) })
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
