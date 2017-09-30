import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import {compose} from 'recompose'

const enhance = compose(
    connect((state) => {
        const products = _.get(state, ['supply', 'item', 'data', 'products'])
        return {
            products
        }
    })
)

const SupplyProductsSearchField = enhance((props) => {
    const productItems = _.get(props, 'products')

    return (
        <SearchFieldCustom
            getValue={(value) => { return _.get(value, 'id') }}
            getText={(value) => { return _.get(value, ['product', 'name']) }}
            getOptions={() => { return Promise.resolve(productItems) }}
            getItem={(value) => {
                return Promise.resolve(
                    _.find(productItems, (o) => { return _.toInteger(_.get(o, ['id'])) === _.toInteger(value) }))
            }}
                getItemText={(value) => { return _.get(value, ['product', 'name']) }}
            {...props}
        />
    )
})

export default SupplyProductsSearchField
