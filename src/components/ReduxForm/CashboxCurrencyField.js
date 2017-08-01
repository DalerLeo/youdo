import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'

const enhance = compose(
    connect((state) => {
        const currency = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'cashbox', 'value', 'currency', 'name'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        return {
            currency,
            extraLoading
        }
    })
)

const CashboxCurrencyField = enhance((props) => {
    const {currency, extraLoading} = props
    return (
        <div style={{margin: '6px 0 0 10px', display: 'flex', alignItems: 'center'}}>
            { extraLoading && <div><CircularProgress size={20} thickness={2} /></div> }
            {!extraLoading && <div>{currency}</div>}
        </div>
    )
})

export default CashboxCurrencyField
