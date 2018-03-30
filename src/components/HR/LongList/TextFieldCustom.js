import React from 'react'

const TextFieldCustom = ({input, ...defaultProps}) => {

    return (
        <textarea
            rows={1}
            onKeyDown={(event) => { limitLines(event.currentTarget, event) }}
            {...input}
            {...defaultProps}
        />
    )
}

export default TextFieldCustom
