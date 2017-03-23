import React from 'react'
import {Form} from 'semantic-ui-react'

const CheckboxField = (props) => {
    const {input, ...rest} = props
    const {onChange} = input
    const adaptorOnChange = (event, value) => onChange(value.checked)

    return (
        <Form.Checkbox
            label={rest.label}
            placeholder={rest.placeholder}
            onChange={adaptorOnChange}
        />
    )
}

export default CheckboxField
