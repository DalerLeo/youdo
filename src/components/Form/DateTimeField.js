import React from 'react'
import DatePicker from 'react-datepicker'

class DateTimeField extends React.Component {
    componentWillMount () {
        this.resetComponent()
    }

    resetComponent () {
        this.setState({
            value: null
        })
    }

    handleChange = (date) => {
        const {input: {onChange}} = this.props

        this.setState({
            value: date
        })

        onChange(date.format().toString())
    }

    render () {
        const {value} = this.state
        const {label, placeholder, dateFormat} = this.props

        return (
            <DatePicker
                label={label}
                placeholderText={placeholder}
                selected={value}
                dateFormat={dateFormat}
                onChange={this.handleChange}
                showMonthDropdown={true}
                showYearDropdown={true}
                onFocus={() => {}}
                onBlur={() => {}}
            />
        )
    }
}

export default DateTimeField
