import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {UniversalSearchField} from 'components/ReduxForm'
import {hashHistory} from 'react-router'
import * as API from 'constants/api'
const enhance = compose(
  reduxForm({
    form: 'StatDates',
    enableReinitialize: true
  })
)

const StatDates = props => {
  const {filter} = props
  const onChange = (a, value) => {
    const district = _.get(value, 'value')
    return hashHistory.push(filter.createURL({district}))
  }

  return (
    <div style={{width: '200px'}}>
      <Field
        label={'Choose region'}
        listPath={API.REGIONS_LIST}
        name={'district'}
        component={UniversalSearchField}
        onChange={onChange}/>
    </div>
  )
}

export default enhance(StatDates)
