import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {ShiftSearchField, UsersSearchField} from '../ReduxForm'
import toCamelCase from '../../helpers/toCamelCase'

export const MANUFACTURE_ADD_STAF_FORM_OPEN = 'addStaffForm'

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
        form: 'StaffCreateForm',
        enableReinitialize: true
    })
)

const ManufactureStaffCreateForm = enhance((props) => {
    const {classes, handleSubmit} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <form onSubmit={onSubmit}>
            <Field
                name="user"
                component={UsersSearchField}
                className={classes.inputFieldShift}
                label="Сотрудник"
                fullWidth={true}/>
            <Field
                name="shift"
                component={ShiftSearchField}
                className={classes.inputFieldTime}
                label="Смена"
                fullWidth={true}/>
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

ManufactureStaffCreateForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

ManufactureStaffCreateForm.defaultProps = {
    isUpdate: false
}

export default ManufactureStaffCreateForm
