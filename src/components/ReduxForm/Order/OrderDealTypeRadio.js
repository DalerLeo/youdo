import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    connect((state) => {
        const dealType = _.get(state, ['form', 'OrderCreateForm', 'values', 'dealType'])
        return {
            dealType
        }
    }),
)
const OrderDealTypeRadio = enhance((props) => {
    const {input} = props
    return (
        <div style={{width: '205px', marginBottom: '20px'}}>
        <RadioButtonGroup name="dealType" onChange={input.onChange} defaultSelected={input.value}>
            <RadioButton
                value={'standart'}
                style={{margin: '10px 0'}}
                label="Стандартная"
            />
            <RadioButton
                value={'consignment'}
                style={{margin: '10px 0'}}
                label="Консигнация"
            />
        </RadioButtonGroup>
        </div>
    )
})

export default OrderDealTypeRadio
