import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const values = _.get(state, ['form', 'SupplyCreateForm', 'values'])
        const extraLoading = _.get(state, ['product', 'extra', 'loading'])
        return {
            values,
            extraLoading
        }
    })
)

const SupplyProductMeasurementField = enhance((props) => {
    const {values} = props
    console.log(values)
    const measurement = _.get(values, ['product', 'value', 'product', 'measurement', 'name'])
    return (
        <div>{measurement}</div>
    )
})

export default SupplyProductMeasurementField
