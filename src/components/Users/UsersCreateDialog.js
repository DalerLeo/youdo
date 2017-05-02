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
import {TextField} from '../ReduxForm'

export const USERS_CREATE_DIALOG_OPEN = 'openCreateDialog'
export const USERS_UPDATE_DIALOG_OPEN = 'openUpdateDialog'

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
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },

        fields: {
            display: ({loading}) => !loading ? 'block' : 'none'
        },

        body: {
            maxHeight: '600px !important',
            padding: '30px !important',
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
        bottomBorder: {
            display: 'flex',
            borderBottom: '2px dashed #efefef',
            marginBottom: '20px',
            paddingBottom: '20px'
        },
        rightBorder: {
            borderRight: '2px dashed #efefef',
            paddingRight: '20px !important'
        },
        paddingLeft: {
            paddingLeft: '20px !important'
        },
        marginTop: {
            marginTop: '-20px !important'
        },
        flex: {
            display: 'flex'
        }
    }),
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
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.body}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fields}>
                    <div>
                        <h4 className={classes.title}> {isUpdate ? 'Изменить категорию' : 'Добавить категорию'}</h4>
                    </div>
                    <div className={classes.bottomBorder}>
                        <Col xs={6}>
                            <Field
                                name="name"
                                component={TextField}
                                label="Имя"
                                className={classes.marginTop}
                                fullWidth={true}/>
                            <Field
                                name="surname"
                                component={TextField}
                                label="Фамилия"
                                className={classes.marginTop}
                                fullWidth={true}/>
                        </Col>
                        <Col xs={6}>
                            img content
                        </Col>
                    </div>
                    <div className={classes.bottomBorder}>
                        <Col xs={6} className={classes.rightBorder}>
                            <Field
                                name="email"
                                component={TextField}
                                label="Email"
                                className={classes.marginTop}
                                fullWidth={true}/>
                            <Field
                                name="phoneNumber"
                                component={TextField}
                                label="Телефон"
                                className={classes.marginTop}
                                fullWidth={true}/>
                        </Col>
                        <Col xs={6} className={classes.paddingLeft}>
                            <Field
                                name="typeUser"
                                component={TextField}
                                label="Тип Пользователя"
                                className={classes.marginTop}
                                fullWidth={true}/>
                            <Field
                                name="region"
                                component={TextField}
                                label="Район"
                                className={classes.marginTop}
                                fullWidth={true}/>
                            <Field
                                name="password"
                                component={TextField}
                                label="Пароль"
                                className={classes.marginTop}
                                fullWidth={true}/>
                            <Field
                                name="password"
                                component={TextField}
                                label="Потвердить пароль"
                                className={classes.marginTop}
                                fullWidth={true}/>
                        </Col>
                    </div>
                </div>
                <div>
                    <FlatButton label="Отменить" onTouchTap={onClose}/>
                    <FlatButton type="submit" label="Применить"/>
                </div>
            </form>
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
