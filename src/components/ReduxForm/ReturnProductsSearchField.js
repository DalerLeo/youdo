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
    const Items = _.get(props, 'products')
    let productItems = []
    _.map(Items, (item) => {
        const prodId = _.get(item, ['product', 'id'])
        const prodName = _.get(item, ['product', 'name'])
        productItems.push({id: prodId, name: prodName})
    })

    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={() => { return Promise.resolve(productItems) }}
            getItem={(id) => {
                return Promise.resolve(
                    _.find(productItems, (o) => { return o.id === _.toInteger(id) }))
            }}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
})
ReturnProductsSearchField.propTyeps = {
    orderData: PropTypes.object.isRequired
}
export default ReturnProductsSearchField
