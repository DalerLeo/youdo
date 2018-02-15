import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'
import {
    TextField,
    ImageUploadField,
    CheckBox,
    PositionSearchField,
    PostSearchField
} from '../ReduxForm'
import {connect} from 'react-redux'

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
        errors.password = t('Пароли не совпадают')
    }
    return errors
}

const enhance = compose(
    injectSheet({
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            overflowX: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
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
            justifyContent: 'center',
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
            padding: '10px 30px 0',
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
            margin: '5px 0',
            '& > div': {
                display: 'flex',
                width: '100%',
                flexWrap: 'wrap',
                '& > div': {
                    flexBasis: 'calc(100% / 3)',
                    maxWidth: 'calc(100% / 3)'
                }
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        subTitle: {
            fontStyle: 'italic',
            margin: '15px 0 10px'
        }
    }),
    reduxForm({
        form: 'UsersCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    connect((state) => {
        const positionGroups = _.get(state, ['position', 'item', 'data', 'groups'])
        const positionLoading = _.get(state, ['position', 'item', 'loading'])
        const isActive = _.get(state, ['form', 'UsersCreateForm', 'values', 'isActive'])
        return {
            positionGroups,
            positionLoading,
            isActive
        }
    })
)

const UsersCreateDialog = enhance((props) => {
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        isUpdate,
        errorData,
        stockListData,
        marketTypeData,
        currencyData,
        positionGroups,
        positionLoading,
        divisionData,
        isActive
    } = props
    const errorText = _.get(errorData, 'errorText')
    const show = _.get(errorData, 'show')
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const agent = _.some(positionGroups, {'name': 'agent'})
    const manufacture = _.some(positionGroups, {'name': 'manufacture'})
    const manager = _.some(positionGroups, {'name': 'manager'})
    const transStyle = {
        transition: 'all 200ms ease',
        maxHeight: isActive && (agent || manager || manufacture) && !positionLoading
            ? '400px'
            : isActive ? '200px' : '20px',
        minHeight: isActive && (agent || manager || manufacture) && !positionLoading
            ? '10px' : isActive ? '5px' : '1px'
    }
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialogAddUser}
            contentStyle={loading ? {width: '400px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменить cотрудника') : t('Добавить cотрудника')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent}>
                        <Row className={classes.field}>
                            <Col xs={7}>
                                <Field
                                    name="firstName"
                                    component={TextField}
                                    label={t('Имя ')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="secondName"
                                    component={TextField}
                                    label={t('Фамилия')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="phoneNumber"
                                    component={TextField}
                                    label={t('Телефон')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="job"
                                    component={PostSearchField}
                                    label={t('Должность')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                <Field
                                    name="isActive"
                                    component={CheckBox}
                                    label={t('Доступ к системе')}/>
                            </Col>
                            <Col xs={5}>
                                <Field
                                    name="image"
                                    component={ImageUploadField}
                                    fullWidth={true}
                                />
                            </Col>
                        </Row>
                        <div>
                            <div className={classes.subTitle}>{t('Организации')}</div>
                            {(!loading) && _.get(divisionData, 'divisionListLoading')
                                ? <div className={classes.groupLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.stocksCheckList}>
                                    {_.map(_.get(divisionData, 'data'), (item, index) => {
                                        const name = _.get(item, 'name')
                                        const id = _.get(item, 'id')
                                        return (
                                            <Field
                                                key={id}
                                                name={'divisions[' + index + '][selected]'}
                                                component={CheckBox}
                                                label={name}/>
                                        )
                                    })}
                                </div>}
                        </div>
                        <div style={transStyle}>
                            {isActive &&
                            <div>
                                <Row className={classes.field}>
                                    <Col xs={6}>
                                        <Field
                                            name="username"
                                            component={TextField}
                                            label={t('Логин')}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <Field
                                            name="position"
                                            component={PositionSearchField}
                                            label={t('Права доступа')}
                                            fullWidth={true}/>
                                    </Col>
                                    <Col xs={6}>
                                        <Field
                                            name="password"
                                            component={TextField}
                                            type="password"
                                            label={isUpdate ? t('Изменить пароль') : t('Пароль')}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <Field
                                            name="passwordExp"
                                            errorText={show ? errorText : ''}
                                            type="password"
                                            component={TextField}
                                            label={t('Подтвердите пароль')}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                    </Col>
                                </Row>
                                {positionLoading &&
                                <div className={classes.groupLoader}>
                                    <Loader size={0.75}/>
                                </div>}
                                {(agent || manager || manufacture) && !positionLoading &&
                                <div>
                                    <div className={classes.subTitle}>{t('Связанные склады')}</div>
                                    {(!loading) && _.get(stockListData, 'stockListLoading')
                                        ? <div className={classes.groupLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <div className={classes.stocksCheckList}>
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
                                    }
                                 </div>}
                                {agent && !positionLoading &&
                                <div>
                                    <div className={classes.subTitle}>{t('Поддерживаемый прайс лист')}</div>
                                    <Row>
                                        {(!loading) && _.get(marketTypeData, 'marketTypeLoading') &&
                                        <div className={classes.groupLoader}>
                                            <Loader size={0.75}/>
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
                                    <div className={classes.subTitle}>{t('Валюты')}</div>
                                    <Row>
                                        {(!loading) && _.get(currencyData, 'currencyListLoading') &&
                                        <div className={classes.groupLoader}>
                                            <Loader size={0.75}/>
                                        </div>}
                                        {!_.get(currencyData, 'currencyListLoading') &&
                                        _.map(_.get(currencyData, 'data'), (item, index) => {
                                            const id = _.get(item, 'id')
                                            const name = _.get(item, 'name')
                                            return (
                                                <div key={id} style={{flexBasis: '33.33333%', maxWidth: '33.33333%', padding: '0 10px'}}>
                                                    <Field
                                                        name={'currencies[' + index + '][selected]'}
                                                        component={CheckBox}
                                                        label={name}/>
                                                </div>
                                            )
                                        })}
                                    </Row>
                                </div>}
                            </div>}
                        </div>
                    </div>
                    <div className={classes.bottomButtonUsers}>
                        <div>
                        </div>
                        <FlatButton
                            label={t('Сохранить')}
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
