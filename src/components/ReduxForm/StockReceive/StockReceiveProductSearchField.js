import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import SearchField from '../Basic/SearchField'
import {compose} from 'recompose'

const enhance = compose(
    connect((state) => {
        const products = _.get(state, ['stockReceive', 'item', 'data', 'products'])
        return {
            products
        }
    })
)

const StockReceiveProductSearchField = enhance((props) => {
    const productItems = _.get(props, 'products')

    return (
        <SearchField
            getValue={(value) => { return value }}
            getText={(value) => { return _.get(value, ['product', 'name']) }}
            getOptions={() => { return Promise.resolve(productItems) }}
            getItem={(value) => {
                return Promise.resolve(
                    _.find(productItems, (o) => { return _.toInteger(_.get(o, ['product', 'id'])) === _.toInteger(_.get(value, ['product', 'id'])) }))
            }}
                getItemText={(value) => { return _.get(value, ['product', 'name']) }}
            {...props}
        />
    )
})

export default StockReceiveProductSearchField
