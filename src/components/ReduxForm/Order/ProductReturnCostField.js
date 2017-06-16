import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import {PRIMARY_CURRENCY_NAME} from '../../../constants/primaryCurrency'
import numberFormat from '../../../helpers/numberFormat'

const enhance = compose(
    connect((state) => {
        const ONE = 1
        const values = _.get(state, ['form', 'OrderReturnForm', 'values'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        const count = _.get(state, ['form', 'OrderReturnForm', 'values', 'amount']) || ONE
        return {
            values,
            count,
            extraLoading
        }
    })
)

const ProductReturnCostField = enhance((props) => {
    const {values, extraLoading, count} = props
    const ZERO = 0
    const cost = _.toNumber(_.get(values, ['product', 'value', 'price']) || ZERO) * _.toNumber(count)
    return (
        <div style={{marginTop: '20px'}}>
            { extraLoading && <div><CircularProgress size={20} thickness={2} /></div> }
            {!extraLoading && <div>{numberFormat(cost, PRIMARY_CURRENCY_NAME)}</div>}
        </div>
    )
})

export default ProductReturnCostField
