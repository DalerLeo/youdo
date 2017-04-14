import React from 'react'
import MUITextField from 'material-ui/TextField'

const errorStyle = {
    textAlign: 'left'
}

const TextField = ({input, label, meta: {error}, ...defaultProps}) => {
    return (
        <MUITextField
            errorText={error}
            errorStyle={errorStyle}
            floatingLabelText={label}
            {...input}
            {...defaultProps}
        />
    )
}

export default TextField
