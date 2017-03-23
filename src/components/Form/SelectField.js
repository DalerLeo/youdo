import React from 'react'
import {Form} from 'semantic-ui-react'

const SelectField = (props) => {
    const {
        input: {
            onChange,
            ...input
        },
        ...rest
    } = props

    const adaptorOnChange = (event, select) => onChange(select.value)

    return (
        <Form.Select
            {...input}
            options={rest.options}
            label={rest.label}
            placeholder={rest.placeholder}
            onChange={adaptorOnChange}
        />
    )
}

export default SelectField
