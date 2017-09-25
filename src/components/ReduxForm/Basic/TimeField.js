import React from 'react'
import injectSheet from 'react-jss'
import TimePicker from 'material-ui/TimePicker'
import {compose} from 'recompose'

const errorStyle = {
    textAlign: 'left'
}

const enhance = compose(
    injectSheet({
        wrapper: {

        }
    })
)

const TimeField = enhance((props) => {
    const {input, label, meta: {error}, ...defaultProps} = props
    input.value = input.value || {}
    return (
        <section>
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
        </section>
    )
})

export default TimeField
