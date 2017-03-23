import _ from 'lodash'
import React from 'react'
import {withState} from 'recompose'
import {DateRangePicker} from 'react-dates'

const enhance = withState('focusedInput', 'setFocusedInput', null)

const DateRangePickerField = enhance((props) => {
    const {input, focusedInput, setFocusedInput} = props
    const {onChange, value} = input

    const startDate = (value && value.startDate) || null
    const endDate = (value && value.endDate) || null

    return (
        <DateRangePicker
            isOutsideRange={_.get(props, 'isOutsideRange')}
            initialVisibleMonth={_.get(props, 'initialVisibleMonth')}
            focusedInput={focusedInput}
            onDatesChange={onChange}
            onFocusChange={setFocusedInput}
            startDate={startDate}
            endDate={endDate}
        />
    )
})

export default DateRangePickerField
