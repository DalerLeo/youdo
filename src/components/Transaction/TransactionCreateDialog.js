import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
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
    SupplyExpenseSearchField
} from '../ReduxForm'
import RateRadioButton from '../ReduxForm/Transaction/RateRadioButton'
import NotFound from '../Images/not-found.png'
import CashboxSearchField from '../ReduxForm/Cashbox/CashBoxSimpleSearch'
import ExpensiveCategoryCustomSearchField from '../ReduxForm/ExpenseCategory/ExpensiveCategoryCustomSearchField'
import {openErrorAction} from '../../actions/error'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import numberFormat from '../../helpers/numberFormat'
import * as ROUTE from '../../constants/routes'
import {Link} from 'react-router'

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
            margin: '15px 0'
        },
        convert: {
            margin: '10px 0',
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
        },
        searchWrapper: {
            padding: '0 30px',
            marginBottom: '10px'
        },
        search: {
            borderBottom: '2px #efefef solid',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
        },
        searchField: {
            display: 'flex',
            color: '#333',
            fontSize: '13px !important',
            width: '100%',
            '& > input': {
                border: 'none',
                outline: 'none',
                height: '35px !important'
            }
        },
        searchButton: {
            width: '35px',
            height: '35px',
            display: 'flex',
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '165px',
            padding: '135px 0 20px',
            textAlign: 'center',
            color: '#999'
        }
    }),
    reduxForm({
        form: 'TransactionCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    connect((state) => {
        const rate = _.get(state, ['form', 'TransactionCreateForm', 'values', 'custom_rate'])
        const amount = _.get(state, ['form', 'TransactionCreateForm', 'values', 'amount'])
        const chosenCashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value'])
        const date = _.get(state, ['form', 'TransactionCreateForm', 'values', 'date'])
        const order = _.get(state, ['form', 'TransactionCreateForm', 'values', 'order', 'value'])
        const incomeCategory = _.get(state, ['form', 'TransactionCreateForm', 'values', 'incomeCategory', 'value'])
        const optionsList = _.get(state, ['expensiveCategory', 'options', 'data', 'results'])
        const incomeCategoryOptions = _.get(state, ['form', 'TransactionCreateForm', 'values', 'incomeCategory', 'value', 'options'])
        const expenseCategoryOptions = _.get(state, ['form', 'TransactionCreateForm', 'values', 'expanseCategory', 'value', 'options'])
        const users = _.get(state, ['form', 'TransactionCreateForm', 'values', 'users'])
        const totalStaffAmount = _.sumBy(users, (item) => {
            return _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        })
        return {
            rate,
            amount,
            chosenCashbox,
            date,
            order,
            optionsList,
            incomeCategoryOptions,
            expenseCategoryOptions,
            totalStaffAmount,
            incomeCategory
        }
    }),
    withState('searchQuery', 'setSearchQuery', ''),
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
const iconStyle = {
    color: '#5d6474',
    width: 22,
    height: 22
}
const NOT_FOUND = -1
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
        searchQuery,
        setSearchQuery,
        totalStaffAmount,
        order,
        expenseCategory,
        incomeCategoryKey,
        additionalData,
        detailCurrency,
        hideRedundant
    } = props

    const canSetCustomRate = checkPermission('can_set_custom_rate')

    const clientOptionId = _.get(_.find(optionsList, {'keyName': 'client'}), 'id')
    const providerOptionId = _.get(_.find(optionsList, {'keyName': 'provider'}), 'id')
    const orderOptionId = _.get(_.find(optionsList, {'keyName': 'order'}), 'id')
    const supplyOptionId = _.get(_.find(optionsList, {'keyName': 'supply'}), 'id')
    const supplyExpenseOptionId = _.get(_.find(optionsList, {'keyName': 'supply_expanse'}), 'id')
    const showClients = isExpense ? _.includes(expenseCategoryOptions, clientOptionId) : _.includes(incomeCategoryOptions, clientOptionId)
    const showProviders = isExpense ? _.includes(expenseCategoryOptions, providerOptionId) : _.includes(incomeCategoryOptions, providerOptionId)
    const showOrders = _.includes(incomeCategoryOptions, orderOptionId)
    const showSupplies = _.includes(expenseCategoryOptions, supplyOptionId)
    const showSupplyExpenses = _.includes(expenseCategoryOptions, supplyExpenseOptionId)

    const onSubmit = handleSubmit(() => props.onSubmit().catch(props.validate))
    const cashboxId = noCashbox ? chosenCashbox : _.get(cashboxData, 'cashboxId')
    const cashbox = _.find(_.get(cashboxData, 'data'), {'id': cashboxId})
    const currency = _.get(cashbox, ['currency', 'name']) || detailCurrency
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const divisionStatus = getConfig('DIVISIONS')
    const convert = convertCurrency(amount, rate)
    const isSalary = _.get(usersData, 'open')
    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase())
    }
    const filterData = _.orderBy(_.get(usersData, 'data'), ['firstName', 'secondName'], ['asc', 'asc'])
    const filteredList = filterData.filter((el) => {
        const searchValue = el.firstName.toLowerCase()
        const searchValue2 = el.secondName.toLowerCase()
        return searchValue.indexOf(searchQuery) !== NOT_FOUND || searchValue2.indexOf(searchQuery) !== NOT_FOUND
    })
    const customRateField = (primaryCurrency !== currency && currency && date && canSetCustomRate)
        ? (
            <Field
                name="custom_rate"
                component={TextField}
                label={t('Курс ') + primaryCurrency}
                className={classes.inputFieldCustom}
                normalize={normalizeNumber}
                fullWidth={true}/>
        )
        : null
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading
                ? {minWidth: '300px'}
                : isSalary ? {width: '1000px', maxWidth: 'none'} : {width: '500px'}}
            bodyClassName={classes.popUp}>
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
                        <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        {noCashbox
                            ? <div style={{marginTop: '10px'}}>
                                <Field
                                    name="cashbox"
                                    className={classes.inputFieldCustom}
                                    component={CashboxSearchField}
                                    label={t('Касса')}/>
                            </div>
                            : <div className={classes.itemList}>
                                <div className={classes.label}>{t('Касса')}:</div>
                                <div style={{fontWeight: '600', marginBottom: '5px'}}>{_.get(cashbox, 'name')}</div>
                            </div>}
                        {divisionStatus && <Field
                            name="division"
                            component={DivisionSearchField}
                            label={t('Организация')}
                            className={classes.inputFieldCustom}
                            fullWidth={true}/>}
                        {!hideRedundant &&
                        <Field
                            name="date"
                            className={classes.inputDateCustom}
                            component={DateField}
                            fullWidth={true}
                            container="inline"
                            label={t('Дата создания')}/>}

                        {isExpense
                            ? <div className={classes.field}>
                                <Field
                                    name="expanseCategory"
                                    data-key-name={expenseCategory}
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
                                    {!isSalary &&
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
                                {(convert && rate && primaryCurrency !== currency)
                                    ? <div className={classes.convert}>После конвертации:
                                        <strong>{convert} {primaryCurrency}</strong>
                                    </div> : null}
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label={t('Комментарий') + '...'}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={2}
                                    fullWidth={true}/>
                            </div>
                            : <div className={classes.field}>
                                <Field
                                    name="incomeCategory"
                                    data-key-name={incomeCategoryKey}
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
                                {!isSalary &&
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
                                {(convert && rate && primaryCurrency !== currency)
                                    ? <div className={classes.convert}>{t('После конвертации')}:
                                        <strong> {convert} {primaryCurrency}</strong>
                                    </div> : null}
                                <Field
                                    name="comment"
                                    style={{top: '-20px', lineHeight: '20px', fontSize: '13px'}}
                                    component={TextField}
                                    label={t('Комментарий') + '...'}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={3}
                                    fullWidth={true}/>
                            </div>}
                        <Field
                            name="currencyRate"
                            currency={currency}
                            rate={rate}
                            showOrderRate={Boolean(showOrders && order)}
                            canSetCustomRate={canSetCustomRate}
                            customRateField={customRateField}
                            component={RateRadioButton}
                        />
                    </div>
                    {isSalary &&
                    <div className={classes.salaryWrapper}>
                        <div className={classes.subTitle}>{t('Список сотрудников')}</div>
                        <div className={classes.searchWrapper}>
                            <form onSubmit={onSubmit}>
                                <div className={classes.search}>
                                    <div className={classes.searchField}>
                                        <input
                                            type="text"
                                            placeholder={t('Поиск сотрудников...')}
                                            onChange={handleSearch}/>
                                        <div className={classes.searchButton}>
                                            <SearchIcon style={iconStyle}/>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {_.get(usersData, 'loading')
                            ? <div className={classes.usersLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : _.isEmpty(filteredList)
                                ? <div className={classes.emptyQuery}>
                                    <div>Сотрудников не найдено...</div>
                                </div>
                                : _.map(filteredList, (item) => {
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
                    {isSalary && <div className={classes.commentField}>
                        {isExpense ? t('Сумма расхода') : t('Сумма прихода')}: <b>{numberFormat(totalStaffAmount, _.get(cashbox, ['currency', 'name']))}</b>
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
