import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const enhance = compose(
    connect((state) => {
        const measurement = _.get(state, ['product', 'measurement', 'data'])
        const measurementLoading = _.get(state, ['product', 'measurement', 'loading'])
        return {
            measurement,
            measurementLoading
        }
    })
)

const ProductMeasurementField = enhance((props) => {
    const {measurement, measurementLoading} = props
    return (
        <div>
            { measurementLoading && <div>...</div> }
            {!measurementLoading && <div>{measurement}</div>}
        </div>
    )
})

export default ProductMeasurementField
