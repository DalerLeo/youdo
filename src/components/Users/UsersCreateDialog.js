import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, ImageUploadField, UsersGroupSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const USERS_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        dialogAddUser: {
            overflowY: 'auto !important',
            '& div:first-child div:first-child': {
                transform: 'translate(0px, 0px) !important'
            },
            '& .imageDropZone': {
                width: '150px !important',
                height: '145px !important',
                '& svg': {
                    width: '30px !important',
                    height: '30px !important'
                }
            }
        }
    })),
    reduxForm({
        form: 'UsersCreateForm',
        enableReinitialize: true
    })
)

const UsersCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialogAddUser}
            contentStyle={loading ? {width: '300px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить пользователя' : 'Добавить пользователя'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent} style={{display: 'block', minHeight: '350px'}}>
                        <Row className={classes.field}>
                            <Col xs={7} style={{paddingTop: '15px'}}>
                                <Field
                                    name="firstName"
                                    component={TextField}
                                    label="Имя"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="secondName"
                                    component={TextField}
                                    label="Фамилия"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="typeUser"
                                    component={UsersGroupSearchField}
                                    label="Тип Пользователя"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={5}>
                                <Field
                                    name="image"
                                    className={classes.imageUpload}
                                    component={ImageUploadField}
                                    fullWidth={true}
                                />
                            </Col>
                        </Row>
                        <div className="dottedList"></div>
                        <Row className={classes.field} style={{paddingTop: '15px'}}>
                            <Col xs={6}>
                                <Field
                                    name="username"
                                    component={TextField}
                                    label="Логин"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="phoneNumber"
                                    component={TextField}
                                    label="Телефон"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={6}>
                                <Field
                                    name="password"
                                    component={TextField}
                                    label="Пароль"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="password"
                                    component={TextField}
                                    label="Подтвердите пароль"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                            </Col>
                        </Row>
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

UsersCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default UsersCreateDialog
