import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import {PRIMARY_CURRENCY_NAME} from '../../constants/primaryCurrency'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
    connect((state) => {
        const ONE = 1
        const extra = _.get(state, ['product', 'extra', 'data'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        const count = _.get(state, ['form', 'OrderCreateForm', 'values', 'amount']) || ONE
        return {
            extra,
            count,
            extraLoading
        }
    })
)

const ProductCostField = enhance((props) => {
    const {extra, extraLoading, count} = props
    const ZERO = 0
    const cost = _.toNumber(_.get(extra, ['product', 'price']) || ZERO) * _.toNumber(count)
    return (
        <div style={{marginTop: '20'}}>
            { extraLoading && <div><CircularProgress size={20} thickness={2} /></div> }
            {!extraLoading && <div>{numberFormat(cost, PRIMARY_CURRENCY_NAME)}</div>}
        </div>
    )
})

export default ProductCostField
