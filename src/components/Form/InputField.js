import React from 'react'
import {Form} from 'semantic-ui-react'

const InputField = (props) => {
    const {input, ...rest} = props

    return (
        <Form.Input
            {...input}
            label={rest.label}
            placeholder={rest.placeholder}
        />
    )
}

export default InputField
