import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'

const checkboxStyle = {
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px'
}

const Checkbox = ({input, meta, label, ...defaultProps}) => (
    <MUICheckbox
        label={label}
        style={checkboxStyle}
        checked={Boolean(input.value)}
        onCheck={input.onChange}
        {...defaultProps}
    />
)

export default Checkbox
