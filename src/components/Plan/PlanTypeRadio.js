import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const radioButtonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
}

const PlanTypeRadio = (props) => {
    const {input, isUpdate} = props
    if (!input.value && isUpdate) {
        return null
    }
    return (
        <RadioButtonGroup
            name="planType"
            style={radioButtonGroupStyle}
            onChange={input.onChange}
            defaultSelected={input.value}>
            <RadioButton
                value={'week'}
                style={{width: '150px'}}
                label="На неделю"
            />
            <RadioButton
                value={'month'}
                style={{width: '150px'}}
                label="На месяц"
            />
        </RadioButtonGroup>
    )
}

export default PlanTypeRadio
