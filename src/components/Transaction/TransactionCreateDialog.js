import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError, FieldArray} from 'redux-form'
import {connect} from 'react-redux'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import toCamelCase from '../../helpers/toCamelCase'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'
import checkPermission from '../../helpers/checkPermission'
import {convertCurrency} from '../../helpers/convertCurrency'
import {
    TextField,
    ClientSearchField,
    normalizeNumber,
    DivisionSearchField,
    DateField,
    ProviderSearchField,
    TransactionIncomeCategory,
    OrderSearchField,
    SupplySearchField,
    SupplyExpenseSearchField,
    CashBoxSimpleSearch
} from '../ReduxForm'
import RateRadioButton from '../ReduxForm/Transaction/RateRadioButton'
import ExpensiveCategoryCustomSearchField from '../ReduxForm/ExpenseCategory/ExpensiveCategoryCustomSearchField'
import {openErrorAction} from '../../actions/error'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import numberFormat from '../../helpers/numberFormat'
import * as ROUTE from '../../constants/routes'
import {Link} from 'react-router'
import TransactionCreateSalary from './TransactionCreateSalary'
import TransactionCreateDetalization from './TransactionCreateDetalization'
import formValidate from '../../helpers/formValidate'

const validateForm = values => {
    const errors = {}
    if (values.showClients && values.amount && !values.client) {
        errors.client = t('Клиент не выбран')
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
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inContent: {
            display: 'flex',
            minHeight: '184px',
            overflow: 'unset',
            padding: '0 30px 20px',
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
                width: '500px'
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
            marginTop: '7px',
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
            margin: '15px 0'
        },
        convert: {
            margin: '20px 0 10px',
            '& strong': {
                marginLeft: '5px'
            }
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
        commentField: {
            padding: '5px 20px',
            fontSize: '14px',
            textAlign: 'left',
            width: '50%',
            float: 'left'
        }
    }),
    reduxForm({
        form: 'TransactionCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    connect((state) => {
        const rate = _.get(state, ['form', 'TransactionCreateForm', 'values', 'customRate'])
        const amount = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amount'])
        const chosenCashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value'])
        const date = _.get(state, ['form', 'TransactionCreateForm', 'values', 'date'])
        const order = _.get(state, ['form', 'TransactionCreateForm', 'values', 'order', 'value'])
        const division = _.get(state, ['form', 'TransactionCreateForm', 'values', 'division', 'value'])
        const supply = _.get(state, ['form', 'TransactionCreateForm', 'values', 'supply', 'value'])
        const supplyExpense = _.get(state, ['form', 'TransactionCreateForm', 'values', 'supplyExpense', 'value'])
        const incomeCategory = _.get(state, ['form', 'TransactionCreateForm', 'values', 'incomeCategory', 'value'])
        const optionsList = _.get(state, ['expensiveCategory', 'options', 'data', 'results'])
        const incomeCategoryOptions = _.get(state, ['form', 'TransactionCreateForm', 'values', 'incomeCategory', 'value', 'options'])
        const expenseCategoryOptions = _.get(state, ['form', 'TransactionCreateForm', 'values', 'expenseCategory', 'value', 'options'])
        const users = _.get(state, ['form', 'TransactionCreateForm', 'values', 'users'])
        return {
            rate,
            amount,
            chosenCashbox,
            date,
            order,
            supply,
            supplyExpense,
            division,
            optionsList,
            incomeCategoryOptions,
            expenseCategoryOptions,
            users,
            incomeCategory
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
    const {
        open,
        loading,
        handleSubmit,
        onClose,
        classes,
        cashboxData,
        isExpense,
        rate,
        amount,
        noCashbox,
        chosenCashbox,
        usersData,
        date,
        optionsList,
        incomeCategoryOptions,
        expenseCategoryOptions,
        users,
        order,
        supply,
        supplyExpense,
        division,
        expenseCategoryKey,
        incomeCategoryKey,
        additionalData,
        hideRedundant,
        dispatch
    } = props

    const formNames = [
        'cashbox',
        'division',
        'date',
        'expenseCategory',
        'supply',
        'supplyExpense',
        'client',
        'provider',
        'amount',
        'incomeCategory',
        'order',
        'comment',
        'currencyRate'
    ]
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))

    const totalStaffAmount = _.sumBy(_.toArray(users), (item) => {
        return _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
    })

    const canSetCustomRate = checkPermission('can_set_custom_rate')

    const clientOptionId = _.get(_.find(optionsList, {'keyName': 'client'}), 'id')
    const providerOptionId = _.get(_.find(optionsList, {'keyName': 'provider'}), 'id')
    const orderOptionId = _.get(_.find(optionsList, {'keyName': 'order'}), 'id')
    const supplyOptionId = _.get(_.find(optionsList, {'keyName': 'supply'}), 'id')
    const supplyExpenseOptionId = _.get(_.find(optionsList, {'keyName': 'supply_expense'}), 'id')
    const detailizationOptionId = _.get(_.find(optionsList, {'keyName': 'transaction_child'}), 'id')
    const staffExpenseOptionId = _.get(_.find(optionsList, {'keyName': 'staff_expense'}), 'id')

    const showClients = isExpense ? _.includes(expenseCategoryOptions, clientOptionId) : _.includes(incomeCategoryOptions, clientOptionId)
    const showProviders = isExpense ? _.includes(expenseCategoryOptions, providerOptionId) : _.includes(incomeCategoryOptions, providerOptionId)
    const showDetalization = isExpense ? _.includes(expenseCategoryOptions, detailizationOptionId) : _.includes(incomeCategoryOptions, detailizationOptionId)
    const showStaffExpense = isExpense ? _.includes(expenseCategoryOptions, staffExpenseOptionId) : _.includes(incomeCategoryOptions, staffExpenseOptionId)
    const showOrders = _.includes(incomeCategoryOptions, orderOptionId)
    const showSupplies = _.includes(expenseCategoryOptions, supplyOptionId)
    const showSupplyExpenses = _.includes(expenseCategoryOptions, supplyExpenseOptionId)

    const cashboxId = noCashbox ? chosenCashbox : _.get(cashboxData, 'cashboxId')
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': cashboxId})
    const currency = _.get(cashbox, ['currency', 'name'])
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const divisionStatus = getConfig('DIVISIONS')
    const isSalary = _.get(usersData, 'open')
    const amountToConvert = (isSalary && showStaffExpense) ? totalStaffAmount : amount
    const convert = convertCurrency(amountToConvert, rate)
    const customRateField = (primaryCurrency !== currency && currency && date && canSetCustomRate)
        ? (
            <Field
                name="customRate"
                component={TextField}
                label={t('Курс ') + primaryCurrency}
                className={classes.inputFieldCustom}
                normalize={normalizeNumber}
                fullWidth={true}/>
        )
        : null
    const pendingsDisableDivision = Boolean(additionalData) && Boolean((order || supply || supplyExpense) && division)
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading
                ? {width: '500px'}
                : ((isSalary && showStaffExpense) || showDetalization) ? {width: '1000px', maxWidth: 'none'} : {width: '500px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
            <div className={classes.titleContent}>
                <span>{isExpense ? t('Расход') : t('Приход')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            {additionalData}
            <div className={classes.bodyContent}>
                <form className={classes.form}>
                    <div className={classes.inContent} style={{minHeight: 'unset', display: 'block'}}>
                        {noCashbox
                            ? <div style={{marginTop: '10px'}}>
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashBoxSimpleSearch}
                                    label={t('Касса')}/>
                            </div>
                            : <div className={classes.itemList}>
                                <div className={classes.label}>{t('Касса')}:</div>
                                <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                            </div>}
                        {divisionStatus && !hideRedundant && <Field
                            name="division"
                            component={DivisionSearchField}
                            label={t('Организация')}
                            disabled={pendingsDisableDivision}
                            className={classes.inputFieldCustom}
                            fullWidth={true}/>}
                        <Field
                            name="date"
                            className={classes.inputDateCustom}
                            errorStyle={{bottom: 2}}
                            component={DateField}
                            fullWidth={true}
                            container="inline"
                            label={t('Дата создания')}/>

                        {isExpense
                            ? <div className={classes.field}>
                                <Field
                                    name="expenseCategory"
                                    params={{'key_name': expenseCategoryKey}}
                                    component={ExpensiveCategoryCustomSearchField}
                                    label={t('Категория расхода')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {showSupplies
                                    ? !hideRedundant && <Field
                                        name="supply"
                                        component={SupplySearchField}
                                        label={t('Поставки')}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/> : null}
                                {showSupplyExpenses
                                    ? !hideRedundant && <Field
                                        name="supplyExpense"
                                        component={SupplyExpenseSearchField}
                                        label={t('Доп. расход')}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/> : null}
                                {showClients
                                    ? <div className={classes.flex}>
                                        <Field
                                            name="client"
                                            component={ClientSearchField}
                                            label={t('Клиент')}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <Link target={'_blank'} to={{pathname: ROUTE.CLIENT_LIST_URL, query: {openCreateDialog: true}}}>{t('добавить')}</Link>
                                    </div> : null}
                                {showProviders &&
                                    <div className={classes.flex}>
                                        <Field
                                            name="provider"
                                            component={ProviderSearchField}
                                            label={t('Поставщик')}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <Link target={'_blank'} to={{pathname: ROUTE.PROVIDER_LIST_URL, query: {openCreateDialog: true}}}>{t('добавить')}</Link>
                                    </div>
                                }
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    {!(isSalary && showStaffExpense) &&
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '100%'}}>
                                        <Field
                                            name="amount"
                                            component={TextField}
                                            label={t('Сумма')}
                                            normalize={normalizeNumber}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <div style={{marginLeft: '5px'}}>{currency}</div>
                                    </div>}
                                </div>
                            </div>
                            : <div className={classes.field}>
                                <Field
                                    name="incomeCategory"
                                    params={{'key_name': incomeCategoryKey}}
                                    component={TransactionIncomeCategory}
                                    label={t('Категория прихода')}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}/>
                                {showOrders
                                    ? !hideRedundant && <Field
                                        name="order"
                                        component={OrderSearchField}
                                        label="Заказ"
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/> : null}
                                {showClients
                                    ? <div className={classes.flex}>
                                        <Field
                                            name="client"
                                            component={ClientSearchField}
                                            label="Клиент"
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <Link target={'_blank'} to={{pathname: ROUTE.CLIENT_LIST_URL, query: {openCreateDialog: true}}}>{t('добавить')}</Link>
                                    </div>
                                    : showProviders
                                        ? <div className={classes.flex}>
                                            <Field
                                                name="provider"
                                                component={ProviderSearchField}
                                                label={t('Поставщик')}
                                                className={classes.inputFieldCustom}
                                                fullWidth={true}/>
                                            <Link target={'_blank'} to={{pathname: ROUTE.PROVIDER_LIST_URL, query: {openCreateDialog: true}}}>{t('добавить')}</Link>
                                        </div>
                                        : null}
                                {!(isSalary && showStaffExpense) &&
                                <div className={classes.flex} style={{justifyContent: 'space-between'}}>
                                    <div className={classes.flex} style={{alignItems: 'baseline', width: '100%'}}>
                                        <Field
                                            name="amount"
                                            component={TextField}
                                            label={t('Сумма')}
                                            normalize={normalizeNumber}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}/>
                                        <div style={{marginLeft: '5px'}}>{currency}</div>
                                    </div>
                                </div>}
                            </div>}
                        <Field
                            name="comment"
                            style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                            component={TextField}
                            label={t('Комментарий') + '...'}
                            multiLine={true}
                            rows={1}
                            rowsMax={3}
                            fullWidth={true}/>
                        <Field
                            name="currencyRate"
                            currency={currency}
                            rate={rate}
                            showOrderRate={Boolean(showOrders && order)}
                            canSetCustomRate={canSetCustomRate}
                            customRateField={customRateField}
                            component={RateRadioButton}
                        />
                        {(convert && rate && primaryCurrency !== currency)
                            ? <div className={classes.convert}>{t('После конвертации')}:
                                <strong> {convert} {primaryCurrency}</strong>
                            </div> : null}
                    </div>
                    {(isSalary && showStaffExpense) && <TransactionCreateSalary usersData={usersData}/>}
                    {showDetalization && <FieldArray name={'transaction_child'} component={TransactionCreateDetalization}/>}
                </form>
                <div className={classes.bottomButton}>
                    {(isSalary && showStaffExpense) && <div className={classes.commentField}>
                        {isExpense ? t('Сумма расхода') : t('Сумма прихода')}: <b>{numberFormat(totalStaffAmount, currency)}</b>
                    </div>}
                    <FlatButton
                        label={t('Сохранить')}
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

TransactionCreateDialog.propTypes = {
    isExpense: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    cashboxData: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}
TransactionCreateDialog.defaultProps = {
    isExpense: false,
    additionalData: null
}

export default TransactionCreateDialog
