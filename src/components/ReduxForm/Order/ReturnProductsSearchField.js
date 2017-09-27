import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
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
    const selectFieldScroll = _.get(props, 'selectFieldScroll')

    return (
        <SearchFieldCustom
            selectFieldScroll={selectFieldScroll}
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
ReturnProductsSearchField.propTyeps = {
    orderData: PropTypes.object.isRequired
}
export default ReturnProductsSearchField
