import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import SearchField from './SearchField'
import {compose} from 'recompose'
import PropTypes from 'prop-types'

const enhance = compose(
    connect((state) => {
        const products = _.get(state, ['order', 'item', 'data', 'products'])
        return {
            products
        }
    })
)

const ReturnProductsSearchField = enhance((props) => {
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
ReturnProductsSearchField.propTyeps = {
    orderData: PropTypes.object.isRequired
}
export default ReturnProductsSearchField
