import _ from 'lodash'
import React from 'react'
import DatePicker from 'material-ui/DatePicker'

class DatePickerDialogField extends React.Component {
    openDatePicker () {
        this.refs.datepicker.openDialog()
    }

    render () {
        return (
            <div>
                <DatePicker textFieldStyle={{display: 'none'}} ref='datepicker' />
            </div>
        )
    }

}

export default DatePickerDialogField
