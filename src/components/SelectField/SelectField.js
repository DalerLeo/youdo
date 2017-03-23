import React from 'react'
import {Form} from 'semantic-ui-react'

const SelectField = (props) => {
    const adaptorOnChange = (event, select) => props.onChange(select.value)

    return (
        <Form.Select
            {...props}
            onChange={adaptorOnChange}
        />
    )
}

export default SelectField
