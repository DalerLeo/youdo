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

const OrderProductMeasurementField = enhance((props) => {
    const {extra, extraLoading} = props
    const measurement = _.get(extra, ['product', 'measurement'])
    return (
        <div style={{marginTop: '20px'}}>
            { extraLoading && <div><CircularProgress size={20} thickness={2} /></div> }
            {!extraLoading && <div>{_.get(measurement, 'name')}</div>}
        </div>
    )
})

export default OrderProductMeasurementField
