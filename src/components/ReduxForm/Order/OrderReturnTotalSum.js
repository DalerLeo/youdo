import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'

const enhance = compose(
    connect((state) => {
        const products = _.get(state, ['form', 'OrderReturnForm', 'values', 'products'])
        return {
            products
        }
    })
)
const OrderReturnTotalSum = enhance((props) => {
    const {products} = props
    const totalCost = _.sumBy(products, (item) => {
        const itemCost = _.toNumber(_.get(item, ['product', 'value', 'price']))
        const itemAmount = _.toNumber(_.get(item, 'amount'))
        return itemAmount * itemCost
    })
    return (
        <b>{numberFormat(totalCost, getConfig('PRIMARY_CURRENCY'))}</b>
    )
})

export default OrderReturnTotalSum
