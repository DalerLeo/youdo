import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import Loader from '../Loader'

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
            { extraLoading && <div><Loader size={0.5}/></div> }
            {!extraLoading && <div>{currency}</div>}
        </div>
    )
})

export default CashboxCurrencyField
