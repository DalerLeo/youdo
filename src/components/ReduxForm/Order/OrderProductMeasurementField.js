import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const measurement = _.get(state, ['form', 'OrderCreateForm', 'values', 'product', 'value', 'measurement', 'name'])
        return {
            measurement
        }
    })
)

const OrderProductMeasurementField = enhance((props) => {
    const {measurement} = props
    return (
        <div style={{marginTop: '20px'}}>{measurement}</div>
    )
})

export default OrderProductMeasurementField
