import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import DatePicker from 'material-ui/DatePicker'
import DateRange from 'material-ui/svg-icons/action/date-range'
import IntlPolyfill from 'intl'
import 'intl/locale-data/jsonp/ru'

const errorStyle = {
    textAlign: 'left'
}

const DateField = ({classes, input, label, meta: {error}, ...defaultProps}) => {
    _.unset(defaultProps, 'sheet')
    if (!_.isObject(input.value)) {
        _.unset(input, 'value')
    }

    let DateTimeFormat = IntlPolyfill.DateTimeFormat

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
                    DateTimeFormat={DateTimeFormat}
                    locale="ru"
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
