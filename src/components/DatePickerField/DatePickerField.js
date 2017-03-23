import _ from 'lodash'
import React from 'react'
import {SingleDatePicker} from 'react-dates'

const DatePickerField = ({input, meta}) => {
    const {onChange, onFocus, onBlur, value} = input
    const date = value || null

    return (
        <SingleDatePicker
            id={_.get(input, 'id')}
            numberOfMonths={1}
            focused={meta.active}
            date={date}
            onDateChange={(event) => {
                onChange(event)
                _.delay(() => onBlur(event))
            }}
            onFocusChange={onFocus}
        />
    )
}

export default DatePickerField

