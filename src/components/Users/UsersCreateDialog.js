import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import CloseIcon2 from '../CloseIcon2'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, ImageUploadField, CheckBox, PositionSearchField, UserStockRadioButtonField} from '../ReduxForm'
import MainStyles from '../Styles/MainStyles'
import getConfig from '../../helpers/getConfig'
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

const validateForm = values => {
    const errors = {}
    if (values.password && values.passwordExp && values.password !== values.passwordExp) {
        errors.password = 'Пароли не совпадают'
    }
    return errors
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
            '& .imageDropZone': {
                width: '150px !important',
                height: '145px !important',
                '& svg': {
                    width: '30px !important',
                    height: '30px !important'
                }
            }
        },
        groupLoader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        inContent: {
            '& .dottedList': {
                padding: '5px'
            }
        },
        bottomButtonUsers: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '59px',
            borderTop: '1px #efefef solid',
            padding: '0 10px 0 30px',
            zIndex: '999',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        stocksCheckList: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '10px',
            '& > div': {
                flexBasis: 'calc(100% / 3)',
                maxWidth: 'calc(100% / 3)',
                overflowX: 'hidden !important',
                '& label': {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: 'calc(100% - 60px)'
                }
            }
        },
        line: {
            background: '#efefef',
            height: '1px',
            margin: '25px -30px 10px'
        },
        radioStock: {
            '& > div': {
                display: 'flex',
                width: '100%',
                '& > div': {
                    flexBasis: 'calc(100% / 3)',
                    maxWidth: 'calc(100% / 3)'
                }
            }
        }
    })),
    reduxForm({
        form: 'UsersCreateForm',
        validate: validateForm,
        enableReinitialize: true
    })
)

const UsersCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate, errorData, stockListData, marketTypeData} = props
    const errorText = _.get(errorData, 'errorText')
    const show = _.get(errorData, 'show')
    const multiStock = getConfig('MULTISELECTSTOCK')
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
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    <div className={classes.inContent} style={{display: 'block', minHeight: '350px', maxHeight: 'none'}}>
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
                                    name="position"
                                    component={PositionSearchField}
                                    label="Должность"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                            </Col>
                            <Col xs={5}>
                                <Field
                                    name="image"
                                    component={ImageUploadField}
                                    fullWidth={true}
                                />
                            </Col>
                        </Row>

                        <div className={classes.line}>
                        </div>

                        <Row className={classes.field}>
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
                                    type="password"
                                    label={isUpdate ? 'Изменить пароль' : 'Пароль'}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="passwordExp"
                                    errorText={show ? errorText : ''}
                                    type="password"
                                    component={TextField}
                                    label="Подтвердите пароль"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                            </Col>
                        </Row>
                        <div className={classes.subTitle} style={{marginTop: '15px'}}>{multiStock ? 'Связанные склады' : 'Связанный склад'}</div>
                        {(!loading) && _.get(stockListData, 'stockListLoading')
                        ? <div className={classes.groupLoader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : (multiStock) ? <div className={classes.stocksCheckList}>
                                {_.map(_.get(stockListData, 'data'), (item, index) => {
                                    const name = _.get(item, 'name')
                                    const id = _.get(item, 'id')
                                    return (
                                        <Field
                                            key={id}
                                            name={'stocks[' + index + '][selected]'}
                                            component={CheckBox}
                                            label={name}/>
                                    )
                                })}
                            </div>
                                : <div className={classes.radioStock}>
                                    <Field
                                        name='radioStock'
                                        stockList={_.get(stockListData, 'data')}
                                        component={UserStockRadioButtonField}/>
                                </div>
                        }
                        <div className={classes.subTitle} style={{marginTop: '15px'}}>Поддерживаемый типа магазинов</div>
                        <Row>
                            {(!loading) && _.get(marketTypeData, 'marketTypeLoading') &&
                            <div className={classes.groupLoader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>}
                            {!_.get(marketTypeData, 'marketTypeLoading') &&
                            _.map(_.get(marketTypeData, 'data'), (item, index) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                return (
                                    <div key={id} style={{flexBasis: '33.33333%', maxWidth: '33.33333%', padding: '0 10px'}}>
                                        <Field
                                            name={'types[' + index + '][selected]'}
                                            component={CheckBox}
                                            label={name}/>
                                    </div>
                                )
                            })}
                        </Row>
                    </div>
                    <div className={classes.bottomButtonUsers}>
                        <div>
                            <Field
                                name="isActive"
                                component={CheckBox}
                                label="Активный"/>
                        </div>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
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
