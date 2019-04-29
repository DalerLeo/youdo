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
        fromDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        toDate: endDate ? endDate.format('YYYY-MM-DD') : null
      })
    }
  })
)

const DateToDateField = ({className, input, ...props}) => {
  const defaultProps = _.omit(props, [
    'setFocusedInput',
    'stateDateWrapper',
    'meta'
  ])
  const from = _.get(input, 'value.fromDate')
  const to = _.get(input, 'value.toDate')
  const startDate = from && moment(from)
  const endDate = to && moment(to)
  return (
    <div className={className} style={{width: '250px'}}>
      <DateRangePicker
        {...defaultProps}
        {...{startDate: startDate, endDate: endDate}}
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
  showClearDates: true,
  // Calendar presentation and interaction related props
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDates: false,
  isOutsideRange: () => false,

  // Internationalization
  displayFormat: () => moment.localeData().longDateFormat('ll'),
  monthFormat: 'MMMM YYYY',
  stateDateWrapper: date => date
}

export default enhance(DateToDateField)
