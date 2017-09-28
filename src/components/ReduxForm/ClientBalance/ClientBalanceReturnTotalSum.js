import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'

const ZERO = 0

const enhance = compose(
    connect((state) => {
        const products = _.get(state, ['form', 'ReturnCreateForm', 'values', 'products'])
        return {
            products
        }
    })
)
const OrderReturnTotalSum = enhance((props) => {
    const {products} = props
    let totalCost = ZERO
    _.map(products, (item) => {
        const itemCost = _.toNumber(_.get(item, ['cost']))
        const itemAmount = _.toNumber(_.get(item, 'amount'))
        totalCost += (itemAmount * itemCost)
    })
    return (
        <b>{numberFormat(totalCost, getConfig('PRIMARY_CURRENCY'))}</b>
    )
})

export default OrderReturnTotalSum
