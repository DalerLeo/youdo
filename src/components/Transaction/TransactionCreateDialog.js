import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {connect} from 'react-redux'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import toBoolean from '../../helpers/toBoolean'
import {convertCurrency} from '../../helpers/convertCurrency'
import {TextField, ExpensiveCategorySearchField, CheckBox, ClientSearchField, normalizeNumber, DivisionSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'
import {openErrorAction} from '../../actions/error'

const validateForm = values => {
    const errors = {}
    if (values.showClients && values.amount && !values.client) {
        errors.client = 'Клиент не выбран'
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
        nav: {
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '20px',
            color: 'black',
            borderBottom: '1px solid #efefef',
            '& button': {
                float: 'right',
                marginTop: '-5px !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontSize: '75%',
            color: '#999'
        },
        itemList: {
            marginTop: '20px'
        },
        convert: {
            margin: '10px 0'
        }
    })),
    reduxForm({
        form: 'TransactionCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    connect((state) => {
        const showClients = _.get(state, ['form', 'TransactionCreateForm', 'values', 'showClients'])
        const rate = _.get(state, ['form', 'TransactionCreateForm', 'values', 'custom_rate'])
        const amount = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amount'])
        return {
            showClients,
            rate,
            amount
        }
    }),
    withHandlers({
        validate: props => (data) => {
            const errors = toCamelCase(data)
            const nonFieldErrors = _.get(errors, 'nonFieldErrors')
            props.dispatch(openErrorAction({
                message: <div>{nonFieldErrors}</div>
            }))
            throw new SubmissionError({
                ...errors,
                _error: nonFieldErrors
            })
        }
    })
)
const TransactionCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, cashboxData, isExpense, showClients, showIncomeClients, rate, amount} = props

    const onSubmit = handleSubmit(() => props.onSubmit().catch(props.validate))
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': _.get(cashboxData, 'cashboxId')})
    const convert = convertCurrency(amount, rate)

    const hasDivisions = toBoolean(getConfig('DIVISIONS'))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isExpense ? 'Расход' : 'Приход'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: '230px'}}>
                        <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        {isExpense
                            ? <div className={classes.field}>
                                <div className={classes.itemList}>
                                    <div className={classes.label}>Касса:</div>
                                    <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                                </div>
                                    <Field
                                        name="showClients"
                                        className={classes.checkbox}
                                        component={CheckBox}
                                        label="Снять со счета клиента"/>
                                    {showClients && <div>
                                        <Field
                                            name="client"
                                            component={ClientSearchField}
                                            label="Клиент"
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                    </div>}
                                    <Field
                                        name="expanseCategory"
                                        component={ExpensiveCategorySearchField}
                                        label="Категория расхода"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="amount"
                                            component={TextField}
                                            label="Сумма"
                                            normalize={normalizeNumber}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <div>{_.get(cashbox, ['currency', 'name'])}</div>
                                    </div>
                                    {(showClients || showIncomeClients) &&
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="custom_rate"
                                            component={TextField}
                                            label="Курс"
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                    </div>}
                                </div>
                                {(convert && showClients) &&
                                <div className={classes.convert}>После конвертации: <strong>{convert}</strong></div>}
                                {hasDivisions && <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    label="Подразделение"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>}
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label="Комментарий..."
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={3}
                                    fullWidth={true}/>
                            </div>
                        : <div className={classes.field}>
                                <div className={classes.itemList}>
                                    <div className={classes.label}>Касса:</div>
                                    <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                                </div>
                                <Field
                                    name="showClients"
                                    className={classes.checkbox}
                                    component={CheckBox}
                                    label="Оплата с клиента"/>
                                {showClients && <div>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        label="Клиент"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </div>
                                }
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="amount"
                                            component={TextField}
                                            label="Сумма"
                                            normalize={normalizeNumber}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <div>{_.get(cashbox, ['currency', 'name'])}</div>
                                    </div>
                                    {(showClients || showIncomeClients) &&
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                        <Field
                                            name="custom_rate"
                                            component={TextField}
                                            label="Курс"
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/>
                                    </div>}
                                </div>
                                {(convert && showClients) &&
                                <div className={classes.convert}>После конвертации: <strong>{convert}</strong></div>}
                                {hasDivisions && <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    label="Подразделение"
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>}
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label="Комментарий..."
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={3}
                                    fullWidth={true}/>
                            </div>}
                    </div>
                    <div className={classes.bottomButton}>
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

TransactionCreateDialog.propTyeps = {
    isExpense: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    cashboxData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
TransactionCreateDialog.defaultProps = {
    isExpense: false
}

export default TransactionCreateDialog
