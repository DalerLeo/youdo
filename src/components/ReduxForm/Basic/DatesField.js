import React from 'react'
import {DateRangePicker} from 'react-dates'
import {compose, withHandlers, withState} from 'recompose'
import moment from 'moment'
import _ from 'lodash'

export const START_DATE = 'startDate'
export const END_DATE = 'endDate'

const enhance = compose(
  withState('focusedInput', 'setFocusedInput', null),
  withHandlers({
    onFocusChange: props => (value) => {
      return props.setFocusedInput(value)
    },
    onDatesChange: props => ({startDate, endDate}) => {
      const {input} = props
      input.onChange({
        startDate, endDate
      })
    }
  })
)

const DateToDateField = props => {
  const values = props.input.value
  const defaultProps = _.omit(props, [
    'setFocusedInput',
    'stateDateWrapper',
    'input',
    'meta'
  ])
  
  return (
    <div style={{width: '250px'}}>
      <DateRangePicker
        {...defaultProps}
        {...values}
      />
    </div>
  )
}

DateToDateField.defaultProps = {
  // Example props for the demo
  startDateId: START_DATE,
  endDateId: END_DATE,
  // Input related props
  startDatePlaceholderText: 'От',
  endDatePlaceholderText: 'До',
  disabled: false,
  required: false,
  block: true,
  small: true,
  noBorder: true,

  // Calendar presentation and interaction related props
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDates: false,

  // Internationalization
  displayFormat: () => moment.localeData().longDateFormat('ll'),
  monthFormat: 'MMMM YYYY',
  stateDateWrapper: date => date
}

export default enhance(DateToDateField)
