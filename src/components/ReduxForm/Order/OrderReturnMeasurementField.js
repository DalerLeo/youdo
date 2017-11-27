import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import Loader from '../../Loader'

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

const OrderReturnMeasurementField = enhance((props) => {
    const {values, extraLoading} = props
    const measurement = _.get(values, ['product', 'value', 'product', 'measurement', 'name'])
    return (
        <div style={{marginTop: '20px'}}>
            { extraLoading && <div><Loader size={0.5}/></div> }
            {!extraLoading && <div>{measurement}</div>}
        </div>
    )
})

export default OrderReturnMeasurementField
