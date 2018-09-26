import React from 'react'
import MUITextField from 'material-ui/TextField'

const textFieldStyles = {
  error: {
    textAlign: 'left',
    bottom: '5px'
  },
  input: {
    fontSize: '13px'
  }
}

const TextField = ({input, label, meta: {error, touched}, withoutErrorText, ...defaultProps}) => {
  return (
    <MUITextField
      errorText={withoutErrorText ? ' ' : touched && error}
      errorStyle={textFieldStyles.error}
      inputStyle={textFieldStyles.input}
      floatingLabelText={label}
      {...input}
      {...defaultProps}
    />
  )
}

export default TextField
