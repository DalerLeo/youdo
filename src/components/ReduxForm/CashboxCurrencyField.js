import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'

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

const CashboxCurrencyField = enhance((props) => {
    const {extra, extraLoading} = props
    return (
        <div style={{margin: '6px 0 0 10px'}}>
            { extraLoading && <div><CircularProgress size={20} thickness={2} /></div> }
            {!extraLoading && <div>UZS</div>}
        </div>
    )
})

export default CashboxCurrencyField
