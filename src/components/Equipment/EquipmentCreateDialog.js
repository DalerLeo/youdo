import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, ManufactureSearchField, ImageUploadField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const EQUIPMENT_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
            display: ({loading}) => !loading ? 'flex' : 'none',
            width: '100%'
        },

        body: {
            minHeight: 'auto'
        },
        form: {
            minHeight: 'auto'
        }
    })),
    reduxForm({
        form: 'EquipmentCreateForm',
        enableReinitialize: true
    })
)

const EquipmentCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить оборудованию' : 'Добавить оборудованию'}</span>
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
                                label="Наименование"
                                fullWidth={true}
                            />
                            <Field
                                name="manufacture"
                                component={ManufactureSearchField}
                                className={classes.inputField}
                                label="Производство"
                                fullWidth={true}
                            />
                            <Field
                                name="image"
                                className={classes.imageUpload}
                                component={ImageUploadField}
                                label="Изображения"
                                fullWidth={true}
                            />
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

EquipmentCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

EquipmentCreateDialog.defaultProps = {
    isUpdate: false
}

export default EquipmentCreateDialog