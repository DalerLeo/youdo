import React from 'react'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const PendingPaymentRadioButton = enhance((props) => {
    const {input} = props

    return (
        <RadioButtonGroup name="now" onChange={input.onChange} defaultSelected={true}>
            <RadioButton
                value={true}
                label="Текущий курс"
            />
            <RadioButton
                value={false}
                label="Курс при оформлении"
            />
        </RadioButtonGroup>
    )
})

export default PendingPaymentRadioButton
