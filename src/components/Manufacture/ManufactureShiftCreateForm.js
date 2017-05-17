import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {TextField, TimeField} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}

const enhance = compose(
    injectSheet({
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                color: '#129fdd !important'
            }
        },
        timePick: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                flexBasis: '49%'
            }
        },
        inputFieldShift: {
            fontSize: '13px !important',
            marginRight: '20px',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        inputFieldTime: {
            fontSize: '13px !important',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        }
    }),
    reduxForm({
        form: 'ShiftCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {classes, handleSubmit, openAddShift, setOpenAddShift} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate).then(setOpenAddShift(!openAddShift)))

    return (
        <form onSubmit={onSubmit}>
            <Field
                name="name"
                component={TextField}
                className={classes.inputFieldShift}
                label="Наименование"
                fullWidth={true}/>
            <div className={classes.timePick}>
                <Field
                    name="beginTime"
                    component={TimeField}
                    className={classes.inputFieldTime}
                    label="Начало"
                    fullWidth={true}/>
                <Field
                    name="endTime"
                    component={TimeField}
                    className={classes.inputFieldTime}
                    label="Конец"
                    fullWidth={true}/>
            </div>
            <div className={classes.buttonSub}>
                <FlatButton
                    label="Применить"
                    className={classes.actionButton}
                    type="submit"
                />
            </div>
        </form>
    )
})

ManufactureAddStaffDialog.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    openAddShift: PropTypes.object,
    setOpenAddShift: PropTypes.object
}

ManufactureAddStaffDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddStaffDialog
