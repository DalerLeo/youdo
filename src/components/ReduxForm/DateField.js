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
            <div style={{position: 'relative'}}>
                <DatePicker
                    errorText={error}
                    errorStyle={errorStyle}
                    floatingLabelText={label}
                    {...input}
                    onChange={(event, value) => input.onChange(value)}
                    {...defaultProps}
                    okLabel="Ок"
                    cancelLabel="Отмена"
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
    icon: {
        position: 'absolute',
        right: '0',
        top: '14px',
        '& svg': {
            color: '#ccc !important',
            height: '20px !important',
            width: '20px !important'
        }
    }
})(DateField)
