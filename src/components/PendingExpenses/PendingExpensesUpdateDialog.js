import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, LocationField, CategorySearchField} from '../ReduxForm'

export const PENDING_EXPENSES_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
        dialog: {
            '& div:last-child': {
                textAlign: 'left !important',
                '& button': {
                    marginLeft: '50px !important',
                    marginBottom: '5px !important',
                    color: '#12aaeb !important'
                }
            }
        },

        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },

        fields: {
            display: ({loading}) => !loading ? 'flex' : 'none'
        },

        body: {
            maxHeight: '600px !important',
            padding: '0 0 0 15px !important',
            overflow: 'hidden !important'
        },

        title: {
            width: '220px',
            margin: '0 auto',
            padding: '10px 0',
            textAlign: 'center',
            background: '#12aaeb',
            color: '#fff',
            position: 'relative'
        },

        form: {
            display: 'flex'
        },

        map: {
            height: '600px',
            paddingRight: '0'
        }
    }),
    reduxForm({
        form: 'PendingExpensesCreateForm'
    })
)

const PendingExpensesCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {}}
            bodyClassName={classes.body}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fields}>
                    <Col xs={5}>
                        <div>
                            <h4 className={classes.title}>Add Pending Expenses</h4>
                        </div>
                        <div>
                            <div>
                                <Field
                                    name="name"
                                    component={TextField}
                                    label="Name"
                                    fullWidth={true}
                                />

                                <Field
                                    name="category"
                                    component={CategorySearchField}
                                    label="Category"
                                    fullWidth={true}
                                />

                                <Field
                                    name="address"
                                    component={TextField}
                                    label="Address"
                                    fullWidth={true}
                                />

                                <Field
                                    name="guide"
                                    component={TextField}
                                    label="Guide"
                                    fullWidth={true}
                                />

                                <Field
                                    name="phone"
                                    component={TextField}
                                    label="Phone"
                                    fullWidth={true}
                                />

                                <Field
                                    name="contactName"
                                    component={TextField}
                                    label="Contact name"
                                    fullWidth={true}
                                />

                                <Field
                                    name="official"
                                    component={TextField}
                                    label="Official"
                                    fullWidth={true}
                                />
                            </div>

                            <div>
                                <FlatButton
                                    label="Cancel"
                                    primary={true}
                                    onTouchTap={onClose}
                                />

                                <FlatButton
                                    label="Apply"
                                    primary={true}
                                    type="submit"
                                    keyboardFocused={true}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={7} className={classes.map}>
                        <Field
                            name="latLng"
                            component={LocationField}
                            fullWidth={true}
                        />
                    </Col>
                </div>
            </form>
        </Dialog>
    )
})

PendingExpensesCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

export default PendingExpensesCreateDialog
