import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field, reduxForm} from 'redux-form'
import TrackingDateField from '../ReduxForm/TrackingDateField'

const enhance = compose(
    injectSheet({
        padding: {
            padding: '0px 30px'
        },
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            height: '55px',
            extend: 'padding',
            '& a': {
                fontWeight: '600'
            }
        },
        datePicker: {
            background: '#fff',
            padding: '10px 0 20px',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2',
            '& > div': {
                textAlign: 'center'
            }
        }
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    }),
)

const TrackingDatePicker = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.titleDate}>
            <Field
                name="date"
                className={classes.inputDateCustom}
                component={TrackingDateField}
                fullWidth={true}
                />
        </div>
    )
})

export default TrackingDatePicker
