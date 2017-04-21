/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import MUITextField from 'material-ui/TextField'

const DELAY = 300

class DateToDateField extends React.Component {
    datePicker = null

    constructor (props) {
        super(props)
        this.state = {
            starting: false
        }
    }

    handleOnFocus = () => {
        _.delay(() => this.datePicker.show(), DELAY)
    }

    handleOnAccept = (value) => {
        const {input} = this.props
        const fromDate = _.get(input, ['value', 'fromDate'])

        if (!fromDate || !this.state.starting) {
            input.onChange({fromDate: moment(value)})
            this.setState({starting: true})
            _.delay(() => this.datePicker.show(), DELAY)
        } else {
            input.onChange({
                fromDate: _.get(input, ['value', 'fromDate']),
                toDate: moment(value)
            })
            this.setState({starting: false})
        }
    }

    textField = () => {
        const {input, format} = this.props
        const fromDate = _.get(input, ['value', 'fromDate'])
        const toDate = _.get(input, ['value', 'toDate'])

        if (fromDate && !toDate) {
            return moment(fromDate).format(format)
        }

        if (fromDate && toDate) {
            return moment(fromDate).format(format) + ' - ' + moment(toDate).format(format)
        }

        return ''
    }

    getMinDate = () => {
        const {input} = this.props
        const fromDate = _.get(input, ['value', 'fromDate'])
        const toDate = _.get(input, ['value', 'toDate'])

        if (fromDate && !toDate) {
            return fromDate.toDate()
        }

        return undefined
    }

    render () {
        const {label, meta: {error}} = this.props

        return (
            <div>
                <DatePickerDialog
                    ref={(element) => {
                        this.datePicker = element
                    }}
                    minDate={this.getMinDate()}
                    onAccept={this.handleOnAccept}
                    firstDayOfWeek={0}
                />
                <MUITextField
                    errorText={error}
                    floatingLabelText={label}
                    onFocus={this.handleOnFocus}
                    value={this.textField()}
                />
            </div>
        )
    }
}

DateToDateField.defaultProps = {
    format: 'DD.MM.YYYY'
}

DateToDateField.propTypes = {
    format: PropTypes.string
}

export default DateToDateField