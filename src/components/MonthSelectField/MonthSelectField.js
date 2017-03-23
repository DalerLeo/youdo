import React from 'react'
import SelectField from '../SelectField'

const months = [
    {
        text: 'January',
        value: 1
    },
    {
        text: 'February',
        value: 2
    },
    {
        text: 'March',
        value: 3
    },
    {
        text: 'April',
        value: 4
    },
    {
        text: 'May',
        value: 5
    },
    {
        text: 'June',
        value: 6
    },
    {
        text: 'July',
        value: 7
    },
    {
        text: 'August',
        value: 8
    },
    {
        text: 'September',
        value: 9
    },
    {
        text: 'October',
        value: 10
    },
    {
        text: 'November',
        value: 11
    },
    {
        text: 'December',
        value: 12
    }
]

const MonthSelectField = (props) => {
    return (
        <SelectField
            placeholder="Month"
            options={months}
            {...props.input}
        />
    )
}

export default MonthSelectField
