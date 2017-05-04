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

const colorBlue = '#129fdd !important'
const enhance = compose(
    injectSheet({
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        fieldsWrap: {
            display: ({loading}) => !loading ? 'flex' : 'none',
            width: '100%'
        },
        field: {
            width: '100%'
        },
        body: {
            overflowY: 'auto !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '20px !important'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: '#333'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                position: 'absolute !important',
                right: '10px',
                top: '50%',
                padding: '0 !important',
                marginTop: '-24px !important'
            }
        },
        form: {
            display: 'flex',
            padding: '35px 10px 76px'
        },
        inputField: {
            fontSize: '13px !important'
        },
        imageUpload: {
            width: '100px'
        },
        bottomButton: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '20px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: colorBlue
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '12px -30px 0',
            padding: '20px 30px'
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
            </form>
            <div className={classes.bottomButton}>
                <FlatButton
                    label="Сохранить"
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                    keyboardFocused={true}
                />
            </div>
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
