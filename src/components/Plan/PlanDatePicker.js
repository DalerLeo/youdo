import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Calendar from 'material-ui/svg-icons/action/today'
import {Field, reduxForm} from 'redux-form'
import PlanDateToDateField from '../ReduxForm/Basic/PlanDateToDateField'

const enhance = compose(
    injectSheet({
        padding: {
            padding: '20px 30px'
        },
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            extend: 'padding',
            '& svg': {
                minWidth: '32px',
                width: '32px !important',
                height: '32px !important',
                marginRight: '10px'
            },
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
        form: 'PlanDatePicker',
        enableReinitialize: true
    }),
)

const PlanDatePicker = enhance((props) => {
    const {classes, PlanDateInitialValues} = props
    return (
        <div className={classes.titleDate}>
            <Calendar color="#666"/>
            <Field
                name="period"
                className={classes.inputDateCustom}
                component={PlanDateToDateField}
                initialValues={PlanDateInitialValues.initialValues}
                fullWidth={true}
                />
        </div>
    )
})

export default PlanDatePicker
