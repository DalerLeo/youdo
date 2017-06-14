import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {PRIMARY_CURRENCY_NAME} from '../../../constants/primaryCurrency'
import numberFormat from '../../../helpers/numberFormat'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'

const ZERO = 0

const enhance = compose(
    connect((state) => {
        const ONE = 1
        const extra = _.get(state, ['product', 'extra', 'data'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        const count = _.get(state, ['form', 'OrderCreateForm', 'values', 'amount']) || ONE
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        const deliveryPrice = _.get(state, ['form', 'OrderCreateForm', 'values', 'deliveryPrice'])
        const discountPercent = _.get(state, ['form', 'OrderCreateForm', 'values', 'discountPrice']) || ZERO
        return {
            extra,
            count,
            products,
            deliveryPrice,
            discountPercent,
            extraLoading
        }
    })
)
const OrderTotalSum = enhance((props) => {
    const {products, deliveryPrice, discountPercent} = props
    const HUNDRED = 100
    let totalCost = ZERO
    _.map(products, (item) => {
        totalCost += _.toNumber(_.get(item, 'cost'))
    })
    const orderTotal = (totalCost + numberWithoutSpaces(deliveryPrice)) * ((HUNDRED - _.toNumber(discountPercent)) / HUNDRED)
    return (
        <b>{numberFormat(orderTotal, PRIMARY_CURRENCY_NAME)}</b>
    )
})

export default OrderTotalSum
