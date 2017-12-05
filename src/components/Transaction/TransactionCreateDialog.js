import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {connect} from 'react-redux'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import {convertCurrency} from '../../helpers/convertCurrency'
import {
    TextField,
    ExpensiveCategorySearchField,
    CheckBox,
    ClientSearchField,
    normalizeNumber,
    DivisionSearchField,
    DateField
} from '../ReduxForm'

import CashboxSearchField from '../ReduxForm/Cashbox/CashBoxSimpleSearch'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {openErrorAction} from '../../actions/error'

const validateForm = values => {
    const errors = {}
    if (values.showClients && values.amount && !values.client) {
        errors.client = 'Клиент не выбран'
    }

    return errors
}

const enhance = compose(
    injectSheet({
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
        usersLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        },
        dialog: {
            overflowY: 'auto'
        },
        body: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            minHeight: '317px !important'
        },
        popUp: {
            color: '#333 !important',
            overflow: 'unset !important',
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
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            minHeight: '184px',
            overflow: 'unset',
            padding: '0 30px',
            color: '#333'
        },
        salaryWrapper: {
            borderLeft: '1px #efefef solid',
            maxHeight: '600px',
            overflowY: 'auto'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            '& > div': {
                width: '400px'
            }
        },
        field: {
            width: '100%'
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
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
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
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        subTitle: {
            margin: '10px 30px',
            fontWeight: '600'
        },
        user: {
            padding: '10px 30px',
            maxHeight: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '&:hover': {
                background: '#f2f5f8'
            }
        }
    }),
    reduxForm({
        form: 'TransactionCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    connect((state) => {
        const showClients = _.get(state, ['form', 'TransactionCreateForm', 'values', 'showClients'])
        const rate = _.get(state, ['form', 'TransactionCreateForm', 'values', 'custom_rate'])
        const amount = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amount'])
        const chosenCashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value'])
        const date = _.get(state, ['form', 'TransactionCreateForm', 'values', 'date'])
        const expenseCategory = _.get(state, ['form', 'TransactionCreateForm', 'values', 'expanseCategory', 'value'])
        return {
            showClients,
            rate,
            amount,
            chosenCashbox,
            date,
            expenseCategory
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
const ONE = 1
const TransactionCreateDialog = enhance((props) => {
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        cashboxData,
        isExpense,
        showClients,
        rate,
        amount,
        noCashbox,
        chosenCashbox,
        expenseCategory,
        usersData,
        date
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(props.validate))
    const cashboxId = noCashbox ? chosenCashbox : _.get(cashboxData, 'cashboxId')
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': cashboxId})
    const currency = _.get(cashbox, ['currency', 'name'])
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const divisionStatus = getConfig('DIVISIONS')
    const convert = convertCurrency(amount, rate)
    const isSalary = expenseCategory === ONE
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading
                ? {minWidth: '300px'}
                : isSalary ? {width: '800px', maxWidth: 'none'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isExpense ? 'Расход' : 'Приход'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: 'unset', display: 'block'}}>
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        {noCashbox
                            ? <div style={{marginTop: '15px'}}>
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxSearchField}
                                    label="Касса"/>
                            </div>
                            : <div className={classes.itemList}>
                                <div className={classes.label}>Касса:</div>
                                <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                            </div>}
                        <Field
                            name="date"
                            className={classes.inputDateCustom}
                            component={DateField}
                            fullWidth={true}
                            container="inline"
                            label="Дата создания"/>
                        {isExpense
                            ? <div className={classes.field}>
                                <Field
                                    name="showClients"
                                    className={classes.checkbox}
                                    component={CheckBox}
                                    label="Снять со счета клиента"/>
                                {showClients ? <div>
                                    <Field
                                        name="client"
                                        component={ClientSearchField}
                                        label="Клиент"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                    {divisionStatus && <Field
                                        name="division"
                                        component={DivisionSearchField}
                                        label="Подразделение"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>}
                                </div> : null}
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
                                        <div>{currency}</div>
                                    </div>
                                        <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                            {(primaryCurrency !== currency && currency && date) &&
                                            <Field
                                                name="custom_rate"
                                                component={TextField}
                                                label={'Курс ' + primaryCurrency}
                                                className={classes.inputFieldCustom}
                                                normalize={normalizeNumber}
                                                fullWidth={true}/>}
                                        </div>
                                </div>
                                {(convert && rate && primaryCurrency !== currency)
                                    ? <div className={classes.convert}>После конвертации: <strong>{convert} {primaryCurrency}</strong>
                                    </div> : null}
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label="Комментарий..."
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={2}
                                    fullWidth={true}/>
                            </div>
                            : <div className={classes.field}>
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
                                    {divisionStatus ? <Field
                                        name="division"
                                        component={DivisionSearchField}
                                        label="Подразделение"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/> : null}
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
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '48%'}}>
                                        {(primaryCurrency !== currency && currency && date)
                                        ? <Field
                                            name="custom_rate"
                                            component={TextField}
                                            label={'Курс ' + primaryCurrency}
                                            className={classes.inputFieldCustom}
                                            normalize={normalizeNumber}
                                            fullWidth={true}/> : null}
                                    </div>
                                </div>
                                {(convert && rate && primaryCurrency !== currency)
                                    ? <div className={classes.convert}>После конвертации: <strong>{convert} {primaryCurrency}</strong>
                                    </div> : null}
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
                    {isSalary &&
                    <div className={classes.salaryWrapper}>
                        <div className={classes.subTitle}>Список сотрудников</div>
                        {_.get(usersData, 'loading')
                            ? <div className={classes.usersLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : _.map(_.get(usersData, 'data'), (item) => {
                                const id = _.get(item, 'id')
                                const userName = _.get(item, 'firstName') + ' ' + _.get(item, 'secondName')
                                return (
                                    <div key={id} className={classes.user}>
                                        {userName}
                                        <Field
                                            hintText={'Сумма'}
                                            name={'users[' + id + '][amount]'}
                                            component={TextField}
                                            normalize={normalizeNumber}
                                            hintStyle={{left: 'auto', right: '0'}}
                                            inputStyle={{textAlign: 'right'}}
                                            className={classes.inputFieldCustom}
                                            style={{width: '150px'}}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>}
                </form>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label="Сохранить"
                        className={classes.actionButton}
                        labelStyle={{fontSize: '13px'}}
                        primary={true}
                        onTouchTap={onSubmit}
                    />
                </div>
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
