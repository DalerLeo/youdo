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
import ClientContactsListField from '../ReduxForm/ClientContactsListField'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const CLIENT_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
    injectSheet(_.merge(MainStyles, {
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        contacts: {
            background: '#f1f5f8',
            color: '#333',
            margin: '12px -30px 0',
            padding: '20px 30px'
        }
    })),
    reduxForm({
        form: 'ClientCreateForm',
        enableReinitialize: true
    })
)

const ClientCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменение клиента' : 'Добавление клиента'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.field}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputField}
                                label="Организация"
                                fullWidth={true}/>
                            <Field
                                name="address"
                                component={TextField}
                                className={classes.inputField}
                                label="Местположение"
                                fullWidth={true}/>

                            <div className={classes.contacts}>
                                Контактные данные
                                <FieldArray
                                    name="contacts"
                                    component={ClientContactsListField}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ClientCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ClientCreateDialog.defaultProps = {
    isUpdate: false
}

export default ClientCreateDialog
