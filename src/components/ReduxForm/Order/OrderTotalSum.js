import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'

const ZERO = 0

const enhance = compose(
    connect((state) => {
        const ONE = 1
        const extra = _.get(state, ['product', 'extra', 'data'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        const count = _.get(state, ['form', 'OrderCreateForm', 'values', 'amount']) || ONE
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        return {
            extra,
            count,
            products,
            extraLoading
        }
    })
)
const OrderTotalSum = enhance((props) => {
    const {products} = props
    let totalCost = ZERO
    _.map(products, (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const cost = _.toNumber(_.get(item, 'cost'))
        totalCost += (amount * cost)
    })
    return (
        <b>{numberFormat(totalCost, getConfig('PRIMARY_CURRENCY'))}</b>
    )
})

export default OrderTotalSum
