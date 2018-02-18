import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const measurement = _.get(state, ['form', 'StockReceiveCreateForm', 'values', 'product', 'value', 'product', 'measurement', 'name'])
        return {
            measurement
        }
    })
)

const StockReceiveMeasurementField = enhance((props) => {
    const {measurement} = props
    return (
        <div>{measurement}</div>
    )
})

export default StockReceiveMeasurementField
