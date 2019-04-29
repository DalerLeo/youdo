import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {DatesField} from 'components/ReduxForm'
import {hashHistory} from 'react-router'
const enhance = compose(
  reduxForm({
    form: 'StatDatesForm'
  })
)

const StatDates = props => {
  const {filter} = props
  const onDateChange = (a, {fromDate, toDate}, preValue) => {
    const preFrom = _.get(preValue, 'fromDate')
    const preTo = _.get(preValue, 'toDate')
    if (fromDate !== preFrom || toDate !== preTo) {
      return hashHistory.push(filter.createURL({fromDate, toDate}))
    }
    return null
  }

  return (
    <div>
      <Field name={'dates'} component={DatesField} onChange={onDateChange}/>
    </div>
  )
}

export default enhance(StatDates)
