import React from 'react'
import MUIPasswordField from 'material-ui/PasswordField'

const errorStyle = {
  textAlign: 'left',
  bottom: '5px'
}

const PasswordField = ({input, label, meta: {error}, ...defaultProps}) => {
  return (
    <MUIPasswordField
      errorText={error}
      errorStyle={errorStyle}
      floatingLabelText={label}
      {...input}
      {...defaultProps}
    />
  )
}

export default PasswordField
