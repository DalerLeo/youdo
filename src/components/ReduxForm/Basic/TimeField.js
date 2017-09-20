import React from 'react'
import injectSheet from 'react-jss'
import TimePicker from 'material-ui/TimePicker'

const errorStyle = {
    textAlign: 'left'
}

const TimeField = ({classes, input, sheet, label, meta: {error}, ...defaultProps}) => {
    input.value = input.value || {}
    return (
        <div className={classes.wrapper}>
            <div>
                <TimePicker
                    format="24hr"
                    errorText={error}
                    errorStyle={errorStyle}
                    floatingLabelText={label}
                    {...input}
                    onChange={(event, value) => input.onChange(value)}
                    {...defaultProps}
                />
            </div>
            {error && <span>{error}</span>}
        </div>
    )
}

export default injectSheet({
})(TimeField)
