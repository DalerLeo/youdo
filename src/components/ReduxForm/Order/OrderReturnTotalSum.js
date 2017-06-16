import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {PRIMARY_CURRENCY_NAME} from '../../../constants/primaryCurrency'
import numberFormat from '../../../helpers/numberFormat'

const ZERO = 0

const enhance = compose(
    connect((state) => {
        const ONE = 1
        const extra = _.get(state, ['product', 'extra', 'data'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        const count = _.get(state, ['form', 'OrderReturnForm', 'values', 'amount']) || ONE
        const products = _.get(state, ['form', 'OrderReturnForm', 'values', 'returned_products'])
        return {
            extra,
            count,
            products,
            extraLoading
        }
    })
)
const OrderReturnTotalSum = enhance((props) => {
    const {products} = props
    let totalCost = ZERO
    _.map(products, (item) => {
        const itemCost = _.toNumber(_.get(item, ['product', 'value', 'price']))
        const itemAmount = _.toNumber(_.get(item, 'amount'))
        totalCost += (itemAmount * itemCost)
    })
    return (
        <b>{numberFormat(totalCost, PRIMARY_CURRENCY_NAME)}</b>
    )
})

export default OrderReturnTotalSum
