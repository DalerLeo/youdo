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
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

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
    injectSheet(_.merge(MainStyles, {
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '12px -30px 0',
            padding: '20px 30px'
        }
    })),
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
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyClassName={classes.body}>

            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Добавление поставщика' : 'Изменить поставщика'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fieldsWrap}>
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

                        <div className={classes.background}>
                            Контактные данные
                            <FieldArray
                                name="contacts"
                                component={ProviderContactsListField}
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
