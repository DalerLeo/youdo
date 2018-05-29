import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field, reduxForm} from 'redux-form'
import DateToDateField from '../ReduxForm/Basic/DateToDateFieldChange'

const enhance = compose(
    injectSheet({
      titleDate: {
        width: '200px',
        '& input': {
          cursor: 'pointer !important',
          marginTop: '0 !important',
          textTransform: 'capitalize',
          fontWeight: '700 !important',
          fontSize: '13px !important',
          textAlign: 'right',
          color: '#12aaeb !important'
        },
        '& div': {
          margin: '0'
        },
        '& hr': {
          display: 'none !important'
        }
      }
    }),
    reduxForm({
      form: 'DashboardFilterForm',
      enableReinitialize: true
    }),
)

const Filter = enhance((props) => {
  const {classes, filter} = props
  return (
        <div className={classes.titleDate}>
            <Field
                name="dateRange"
                className={classes.inputDateCustom}
                filter={filter}
                component={DateToDateField}
                fullWidth={true}
            />
        </div>
  )
})

export default Filter
