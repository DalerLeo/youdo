import React from 'react'
import injectSheet from 'react-jss'
import DatePicker from 'material-ui/DatePicker'
import DateRange from 'material-ui/svg-icons/action/date-range'

const errorStyle = {
    textAlign: 'left'
}

const DateField = ({classes, input, label, meta: {error}, ...defaultProps}) => {
    return (
        <div className={classes.wrapper}>
            <div>
                <DatePicker
                    errorText={error}
                    errorStyle={errorStyle}
                    floatingLabelText={label}
                    {...input}
                    onChange={(event, value) => input.onChange(value)}
                    {...defaultProps}
                />
                <div className={classes.icon}>
                    <DateRange />
                </div>
            </div>
            {error && <span>{error}</span>}
        </div>
    )
}

export default injectSheet({
    wrapper: {
        marginTop: '10px',
        position: 'relative'
    },
    icon: {
        position: 'absolute',
        right: '0',
        top: '10px'
    }
})(DateField)
