import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, FieldArray, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField} from '../ReduxForm'
import ProviderContactsListField from '../ReduxForm/ProviderContactsListField'

export const PROVIDER_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const PROVIDER_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
                textAlign: 'center !important',
                '& button': {
                    marginLeft: '20px !important',
                    marginBottom: '5px !important',
                    color: '#12aaeb !important'
                }
            }
        },
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        fields: {
            display: ({loading}) => !loading ? 'block' : 'none',
            width: '100%'
        },
        body: {
            maxHeight: '600px !important',
            padding: '0 20px 20px 20px !important',
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
        background: {
            backgroundColor: '#f1f5f8',
            margin: '0 -20px 20px -20px',
            padding: '0 20px'
        },
        flex: {
            display: 'flex'
        }
    }),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ProviderCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '500px'}}
            bodyClassName={classes.body}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fields}>
                        <div>
                            <h4 className={classes.title}> {isUpdate ? 'Изменить поставщика' : 'Добавить поставщика'}</h4>
                        </div>
                        <div>
                            <div>
                                <Field
                                    name="name"
                                    component={TextField}
                                    label="Организация"
                                    fullWidth={true}/>
                                <Field
                                    name="address"
                                    component={TextField}
                                    label="Местположение"
                                    fullWidth={true}/>
                                <div className={classes.background}>
                                    <FieldArray
                                        name="contacts"
                                        component={ProviderContactsListField}
                                    />
                                </div>
                            </div>
                            <div>
                                <FlatButton
                                    label="Отменить"
                                    primary={true}
                                    onTouchTap={onClose}/>

                                <FlatButton
                                    label="Отправить"
                                    primary={true}
                                    type="submit"
                                    keyboardFocused={true}/>
                            </div>
                        </div>
                </div>
            </form>
        </Dialog>
    )
})

ProviderCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ProviderCreateDialog.defaultProps = {
    isUpdate: false
}

export default ProviderCreateDialog
