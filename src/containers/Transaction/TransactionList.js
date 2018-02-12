import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {reset, change} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import checkPermission from '../../helpers/checkPermission'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import numberFormat from '../../helpers/numberFormat'
import {
    TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN,
    TRANSACTION_CREATE_INCOME_DIALOG_OPEN,
    TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN,
    TRANSACTION_UPDATE_INCOME_DIALOG_OPEN,
    TRANSACTION_CREATE_SEND_DIALOG_OPEN,
    TRANSACTION_DELETE_DIALOG_OPEN,
    TRANSACTION_FILTER_KEY,
    TRANSACTION_FILTER_OPEN,
    TRANSACTION_CASH_DIALOG_OPEN,
    TRANSACTION_ACCEPT_DIALOG_OPEN,
    TRANSACTION_STAFF_EXPENSE_DIALOG,
    TRANSACTION_DETALIZATION_DIALOG,
    TransactionGridList,
    TRANSACTION_ACCEPT_CASH_DETAIL_OPEN,
    TRANSACTION_INFO_OPEN,
    TRANSACTION_EDIT_PRICE_OPEN,
    OPEN_USER,
    OPEN_DIVISION,
    OPEN_CURRENCY,
    OPEN_ORDER
} from '../../components/Transaction'
import {
    transactionCreateExpenseAction,
    transactionCreateIncomeAction,
    transactionUpdateExpenseAction,
    transactionUpdateIncomeAction,
    transactionCreateSendAction,
    transactionListFetchAction,
    transactionDeleteAction,
    transactionItemFetchAction,
    acceptClientTransactionAction,
    acceptCashListFetchAction,
    pendingTransactionFetchAction,
    transactionInfoFetchAction,
    transactionEditPaymentAction,
    deleteTransactionAction,
    transactionConvertAction,
    usersListFetchAction,
    transactionCategoryPopopDataAction,
    transactionDetalizationAction,
    optionsListFetchAction
} from '../../actions/transaction'
import {cashboxListFetchAction} from '../../actions/cashbox'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

const ZERO = 0
const DELETE_TRANSACTION = 'deleteTransaction'
const UPDATE_TRANSACTION = 'updateTransaction'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['transaction', 'item', 'data'])
        const detailLoading = _.get(state, ['transaction', 'item', 'loading'])
        const createLoading = _.get(state, ['transaction', 'create', 'loading'])
        const updateLoading = _.get(state, ['transaction', 'update', 'loading'])
        const list = _.get(state, ['transaction', 'list', 'data'])
        const cashboxList = _.get(state, ['cashbox', 'list', 'data'])
        const cashboxListLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const cashboxListFailed = _.get(state, ['cashbox', 'list', 'failed'])
        const listLoading = _.get(state, ['transaction', 'list', 'loading'])
        const transactionInfo = _.get(state, ['transaction', 'info', 'data'])
        const transactionInfoLoading = _.get(state, ['transaction', 'info', 'loading'])
        const filterForm = _.get(state, ['form', 'TransactionFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const sendForm = _.get(state, ['form', 'TransactionSendForm'])
        const acceptForm = _.get(state, ['form', 'AcceptClientTransactionForm'])
        const updateForm = _.get(state, ['form', 'ClientBalanceUpdateForm'])
        const payment = _.get(state, ['cashbox', 'pending', 'data'])
        const acceptCashData = _.get(state, ['transaction', 'acceptCash', 'data'])
        const acceptCashLoading = _.get(state, ['transaction', 'acceptCash', 'loading'])
        const paymentLoading = _.get(state, ['cashbox', 'pending', 'loading'])
        const filterCashbox = filterHelper(cashboxList, pathname, query)
        const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const categoeyPopopData = _.get(state, ['transaction', 'staffExpense', 'data'])
        const categoeyPopopDataLoading = _.get(state, ['transaction', 'staffExpense', 'loading'])
        const detalizationList = _.get(state, ['transaction', 'detalization', 'data'])
        const detalizationListLoading = _.get(state, ['transaction', 'detalization', 'loading'])

        const date = _.get(state, ['form', 'TransactionCreateForm', 'values', 'date'])
        const cashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value', 'id'])
        const convertAmount = _.get(state, ['pendingPayments', 'convert', 'data', 'amount'])
        const convertLoading = _.get(state, ['pendingPayments', 'convert', 'loading'])

        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(payment, pathname, query, {'page': 'dPage'})

        const usersList = _.get(state, ['users', 'list', 'data'])
        const usersListLoading = _.get(state, ['users', 'list', 'loading'])

        const hasMarket = toBoolean(getConfig('MARKETS_MODULE'))
        const optionsList = _.get(state, ['expensiveCategory', 'options', 'data'])
        const optionsListLoading = _.get(state, ['expensiveCategory', 'options', 'loading'])
        return {
            list,
            query,
            cashboxList,
            cashboxListLoading,
            cashboxListFailed,
            listLoading,
            acceptCashData,
            acceptCashLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterItem,
            filterForm,
            filterCashbox,
            paymentLoading,
            cashboxId,
            createForm,
            sendForm,
            payment,
            acceptForm,
            transactionInfo,
            transactionInfoLoading,
            isSuperUser,
            updateForm,
            date,
            cashbox,
            convertAmount,
            convertLoading,
            usersList,
            usersListLoading,
            hasMarket,
            optionsList,
            optionsListLoading,
            categoeyPopopData,
            categoeyPopopDataLoading,
            detalizationList,
            detalizationListLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.cashboxListLoading && _.isNil(nextProps.cashboxList) && !nextProps.cashboxListFailed
    }, ({dispatch, filterCashbox}) => {
        dispatch(cashboxListFetchAction(filterCashbox))
    }),

    withState('openStaff', 'setOpenStaff', false),
    // EXPENSE && INCOME CATEGORIES
    withPropsOnChange((props, nextProps) => {
        const prevExpenseCat = _.get(props, ['createForm', 'values', 'expanseCategory', 'value', 'options'])
        const nextExpenseCat = _.get(nextProps, ['createForm', 'values', 'expanseCategory', 'value', 'options'])
        const prevIncomeCat = _.get(props, ['createForm', 'values', 'incomeCategory', 'value', 'options'])
        const nextIncomeCat = _.get(nextProps, ['createForm', 'values', 'incomeCategory', 'value', 'options'])
        return (!_.isEqual(prevExpenseCat, nextExpenseCat) && !_.isEmpty(nextExpenseCat)) ||
            (!_.isEqual(prevIncomeCat, nextIncomeCat) && !_.isEmpty(nextIncomeCat))
    }, ({dispatch, createForm, setOpenStaff, location: {query}}) => {
        const category = _.get(createForm, ['values', 'expanseCategory', 'value', 'id']) ||
            _.get(createForm, ['values', 'incomeCategory', 'value', 'id'])
        const form = 'TransactionCreateForm'
        if (_.isInteger(category)) {
            const categoryOptions = _.first(_.get(createForm, ['values', 'expanseCategory', 'value', 'options'])) ||
                _.first(_.get(createForm, ['values', 'incomeCategory', 'value', 'options']))
            const updateTransactionID = _.toInteger(_.get(query, UPDATE_TRANSACTION))
            dispatch(optionsListFetchAction())
                .then((data) => {
                    const options = _.get(data, ['value', 'results'])
                    const staffExpenseOptionId = _.get(_.find(options, {'key_name': 'staff_expanse'}), 'id')
                    const detalizationOptionId = _.get(_.find(options, {'key_name': 'transaction_child'}), 'id')
                    const clientOptionId = _.get(_.find(options, {'key_name': 'client'}), 'id')
                    switch (categoryOptions) {
                        case staffExpenseOptionId: {
                            setOpenStaff(true)
                            dispatch(usersListFetchAction())
                            return updateTransactionID > ZERO
                            ? dispatch(transactionCategoryPopopDataAction(updateTransactionID))
                                .then((value) => {
                                    const values = _.get(value, 'value')
                                    const staffExpense = {}
                                    _.map(_.get(values, 'results'), (item) => {
                                        staffExpense[_.get(item, ['staff', 'id'])] = {
                                            amount: numberFormat(_.get(item, 'amount'))
                                        }
                                    })
                                    dispatch(change(form, 'users', staffExpense))
                                })
                            : null
                        }
                        case detalizationOptionId: {
                            return updateTransactionID > ZERO
                            ? dispatch(transactionDetalizationAction(updateTransactionID))
                                .then((value) => {
                                    const values = _.get(value, 'value')
                                    if (!_.isEmpty(values)) {
                                        dispatch(change(form, 'transaction_child', _.map(values, (item) => {
                                            return {
                                                name: _.get(item, 'name'),
                                                amount: numberFormat(_.get(item, 'amount'))
                                            }
                                        })))
                                    }
                                })
                            : null
                        }
                        default: {
                            setOpenStaff(false)
                            if (categoryOptions !== clientOptionId && !_.isNil(categoryOptions)) {
                                dispatch(change(form, 'client', null))
                            }
                            if (categoryOptions !== staffExpenseOptionId && !_.isNil(categoryOptions)) {
                                dispatch(change(form, 'users', null))
                            }
                            if (categoryOptions !== detalizationOptionId && !_.isNil(categoryOptions)) {
                                dispatch(change(form, 'transaction_child', null))
                            }
                            return null
                        }
                    }
                })
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const cashbox = _.get(props, ['createForm', 'values', 'cashbox', 'value']) || _.get(props, ['location', 'query', 'cashboxId'])
        const nextCashbox = _.get(nextProps, ['createForm', 'values', 'cashbox', 'value']) || _.get(nextProps, ['location', 'query', 'cashboxId'])
        const currencyRate = _.get(props, ['createForm', 'values', 'currencyRate'])
        const nextCurrencyRate = _.get(nextProps, ['createForm', 'values', 'currencyRate'])
        const date = _.get(props, ['createForm', 'values', 'date'])
        const nextDate = _.get(nextProps, ['createForm', 'values', 'date'])
        return (cashbox !== nextCashbox && nextCashbox) || (date !== nextDate && nextDate) || (currencyRate !== nextCurrencyRate && nextCurrencyRate)
    }, ({dispatch, date, createForm, cashboxList, location: {query}}) => {
        const queryCashbox = _.toInteger(_.get(query, 'cashboxId'))
        const queryCurrency = _.toInteger(_.get(query, 'currency'))
        const updateTransaction = _.toInteger(_.get(query, UPDATE_TRANSACTION)) > ZERO
        const cashbox = queryCashbox > ZERO ? queryCashbox : _.get(createForm, ['values', 'cashbox', 'value'])
        const currencyRate = _.get(createForm, ['values', 'currencyRate'])
        const order = _.get(createForm, ['values', 'order', 'value'])
        const currency = queryCashbox > ZERO ? queryCurrency : _.get(_.find(_.get(cashboxList, 'results'), {'id': cashbox}), ['currency', 'id'])
        const form = 'TransactionCreateForm'
        if (date && cashbox) {
            switch (currencyRate) {
                case 'order': return dispatch(transactionConvertAction(date, currency, order))
                    .then((data) => {
                        const customRate = _.get(data, ['value', 'amount'])
                        dispatch(change(form, 'custom_rate', customRate))
                    })
                case 'custom': return updateTransaction ? null : dispatch(change(form, 'custom_rate', ''))
                default: return dispatch(transactionConvertAction(date, currency))
                    .then((data) => {
                        const customRate = _.get(data, ['value', 'amount'])
                        dispatch(change(form, 'custom_rate', customRate))
                    })
            }
        }
        return null
    }),

    withPropsOnChange((props, nextProps) => {
        const currencyRate = _.get(props, ['updateForm', 'values', 'currencyRate'])
        const nextCurrencyRate = _.get(nextProps, ['updateForm', 'values', 'currencyRate'])
        return currencyRate !== nextCurrencyRate && nextCurrencyRate
    }, ({dispatch, date, updateForm, location: {query}}) => {
        const currencyRate = _.get(updateForm, ['values', 'currencyRate'])
        // OR CONDITION is for SuperUser -> handleOpenSuperUserDialog to get SPECIFIC ORDER CURRENCY RATE
        const order = _.get(updateForm, ['values', 'order', 'value']) || _.toInteger(_.get(query, OPEN_ORDER))

        const currency = _.get(updateForm, ['values', 'currency', 'value'])
        const form = 'ClientBalanceUpdateForm'
        const openDialog = _.toInteger(_.get(query, TRANSACTION_EDIT_PRICE_OPEN)) > ZERO
        if (openDialog) {
            switch (currencyRate) {
                case 'order': return dispatch(transactionConvertAction(date, currency, order))
                    .then((data) => {
                        const customRate = _.get(data, ['value', 'amount'])
                        dispatch(change(form, 'custom_rate', customRate))
                    })
                case 'custom': return dispatch(change(form, 'custom_rate', ''))
                default: return dispatch(transactionConvertAction(date, currency))
                    .then((data) => {
                        const customRate = _.get(data, ['value', 'amount'])
                        dispatch(change(form, 'custom_rate', customRate))
                    })
            }
        }
        return null
    }),

    withPropsOnChange((props, nextProps) => {
        return props.convertLoading !== nextProps.convertLoading && nextProps.convertLoading === false
    }, ({dispatch, convertAmount}) => {
        if (convertAmount) {
            const form = 'TransactionCreateForm'
            dispatch(change(form, 'custom_rate', convertAmount))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCashList = toBoolean(_.get(props, ['location', 'query', TRANSACTION_CASH_DIALOG_OPEN]))
        const nextCashList = toBoolean(_.get(nextProps, ['location', 'query', TRANSACTION_CASH_DIALOG_OPEN]))
        return prevCashList !== nextCashList && nextCashList
    }, ({dispatch, location}) => {
        const nextCashList = toBoolean(_.get(location, ['query', TRANSACTION_CASH_DIALOG_OPEN]))
        nextCashList && dispatch(acceptCashListFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const prevInfoList = _.toInteger(_.get(props, ['location', 'query', TRANSACTION_INFO_OPEN]))
        const nextInfoList = _.toInteger(_.get(nextProps, ['location', 'query', TRANSACTION_INFO_OPEN]))
        return prevInfoList !== nextInfoList && nextInfoList
    }, ({dispatch, location}) => {
        const nextInfoList = _.toInteger(_.get(location, ['query', TRANSACTION_INFO_OPEN]))
        nextInfoList && dispatch(transactionInfoFetchAction(nextInfoList))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            updateTransaction: null,
            openAcceptTransactionDialog: null,
            openOrder: null,
            openUser: null,
            openCurrency: null,
            openDivision: null
        }
        const prevCashDetails = (_.get(props, ['location', 'query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        const nextCashDetails = (_.get(nextProps, ['location', 'query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        return (prevCashDetails !== nextCashDetails || ((props.filterItem.filterRequest(except) !== nextProps.filterItem.filterRequest(except)))) && nextCashDetails !== 'false'
    }, ({dispatch, location, filterItem}) => {
        const cashDetails = (_.get(location, ['query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        cashDetails && dispatch(pendingTransactionFetchAction(filterItem))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openStaffExpenseDialog: null,
            openDetalizationDialog: null,
            updateTransaction: null,
            openDivision: null,
            openOrder: null
        }
        return (props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except) &&
            _.isNil(nextProps.query.dPage || nextProps.query.dPageSize || props.query.dPage || props.query.dPageSize)) ||
            (_.get(props, ['location', 'query', 'cashboxId']) !== _.get(nextProps, ['location', 'query', 'cashboxId']))
    }, ({dispatch, filter, location, isSuperUser}) => {
        const cashboxId = _.get(location, ['query', 'cashboxId'])
        dispatch(transactionListFetchAction(filter, cashboxId, isSuperUser))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCategoryPopop = _.toNumber(_.get(props, ['location', 'query', TRANSACTION_STAFF_EXPENSE_DIALOG]))
        const nextCategoryPopop = _.toNumber(_.get(nextProps, ['location', 'query', TRANSACTION_STAFF_EXPENSE_DIALOG]))
        return prevCategoryPopop !== nextCategoryPopop && nextCategoryPopop > ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', TRANSACTION_STAFF_EXPENSE_DIALOG]))
        id && dispatch(transactionCategoryPopopDataAction(id))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCategoryPopop = _.toNumber(_.get(props, ['location', 'query', TRANSACTION_DETALIZATION_DIALOG]))
        const nextCategoryPopop = _.toNumber(_.get(nextProps, ['location', 'query', TRANSACTION_DETALIZATION_DIALOG]))
        return prevCategoryPopop !== nextCategoryPopop && nextCategoryPopop > ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', TRANSACTION_DETALIZATION_DIALOG]))
        id && dispatch(transactionDetalizationAction(id))
    }),

    withHandlers({
        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.TRANSACTION_ITEM_PATH, id),
                query: filter.getParams({[TRANSACTION_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_DELETE_DIALOG_OPEN]: false})})
        },
        handleExpenseConfirmDialog: props => () => {
            const {dispatch, filter, filterCashbox, location: {pathname}, cashboxId, params} = props
            const transId = _.toInteger(_.get(params, 'transactionId'))
            dispatch(transactionDeleteAction(transId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_DELETE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .then(() => {
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenDeleteTransaction: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname: pathname, query: filter.getParams({[DELETE_TRANSACTION]: id})})
        },

        handleCloseDeleteTransaction: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DELETE_TRANSACTION]: false})})
        },
        handleSubmitDeleteTransaction: props => () => {
            const {dispatch, filter, location: {pathname, query}, filterItem} = props
            const transactionId = _.toInteger(_.get(query, DELETE_TRANSACTION))
            dispatch(deleteTransactionAction(transactionId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[DELETE_TRANSACTION]: false})})
                    dispatch(pendingTransactionFetchAction(filterItem))
                    dispatch(acceptCashListFetchAction())
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const staff = _.get(filterForm, ['values', 'staff']) || null
            const withDeleted = _.get(filterForm, ['values', 'with_deleted']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense']) || null

            filter.filterBy({
                [TRANSACTION_FILTER_OPEN]: false,
                [TRANSACTION_FILTER_KEY.TYPE]: joinArray(type),
                [TRANSACTION_FILTER_KEY.CLIENT]: joinArray(client),
                [TRANSACTION_FILTER_KEY.STAFF]: joinArray(staff),
                [TRANSACTION_FILTER_KEY.WITH_DELETED]: withDeleted,
                [TRANSACTION_FILTER_KEY.DIVISION]: joinArray(division),
                [TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE]: joinArray(categoryExpense),
                [TRANSACTION_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [TRANSACTION_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCreateExpenseDialog: props => () => {
            const {dispatch, location: {pathname}, filter, setOpenStaff, convertAmount} = props
            setOpenStaff(false)
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: true})})
            const form = 'TransactionCreateForm'
            dispatch(reset(form))
            Promise.resolve()
                .then(() => {
                    dispatch(change(form, 'custom_rate', convertAmount))
                    dispatch(change(form, 'transaction_child', [{}]))
                })
        },

        handleCloseCreateExpenseDialog: props => () => {
            const {location: {pathname}, filter, setOpenStaff} = props
            setOpenStaff(false)
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateExpenseDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, cashboxId, filterCashbox} = props
            return dispatch(transactionCreateExpenseAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})
                    })
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenCreateIncomeDialog: props => () => {
            const {dispatch, location: {pathname}, filter, convertAmount} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: true})})
            const form = 'TransactionCreateForm'
            dispatch(reset(form))
            Promise.resolve()
                .then(() => {
                    dispatch(change(form, 'custom_rate', convertAmount))
                    dispatch(change(form, 'transaction_child', [{}]))
                })
        },

        handleCloseCreateIncomeDialog: props => () => {
            const {location: {pathname}, filter, setOpenStaff} = props
            setOpenStaff(false)
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, cashboxId, filterCashbox} = props
            return dispatch(transactionCreateIncomeAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})
                    })
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenCreateSendDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_SEND_DIALOG_OPEN]: true})})
            dispatch(reset('TransactionSendForm'))
        },

        handleCloseCreateSendDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateSendDialog: props => (percent, sameCurType) => {
            const {dispatch, sendForm, filter, location: {pathname}, filterCashbox, cashboxList} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            const cashbox = _.find(_.get(cashboxList, 'results'), {'id': _.toNumber(cashboxId)})
            const defaultCurrency = _.get(cashbox, ['currency', 'name'])
            return dispatch(transactionCreateSendAction(_.get(sendForm, ['values']), cashboxId, percent, defaultCurrency, sameCurType))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})
                    })
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleClickCashbox: props => (id, currency) => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {'cashboxId': id, 'currency': currency}})
        },

        handleOpenUpdateDialog: props => (id, amount) => {
            const {filter, dispatch} = props
            const zero = 0
            if (_.toNumber(amount) < zero) {
                hashHistory.push({
                    pathname: sprintf(ROUTER.TRANSACTION_ITEM_PATH, id),
                    query: filter.getParams({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: true})
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.TRANSACTION_ITEM_PATH, id),
                    query: filter.getParams({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: true})
                })
            }
            dispatch(transactionItemFetchAction(id))
        },

        handleCloseUpdateExpenseDialog: props => () => {
            const {location: {pathname}, filter, setOpenStaff} = props
            setOpenStaff(false)
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false})})
        },
        handleCloseUpdateIncomeDialog: props => () => {
            const {location: {pathname}, filter, setOpenStaff} = props
            setOpenStaff(false)
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false})})
        },
        handleOpenCashDialog: props => () => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({pathname, query: filterItem.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: true})})
        },
        handleCloseCashDialog: props => () => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({
                pathname,
                query: filterItem.getParams({
                    [TRANSACTION_CASH_DIALOG_OPEN]: false,
                    [TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]: false,
                    'dPage': null,
                    'dPageSize': null
                })
            })
        },

        handleSubmitCashDialog: props => () => {
            const {dispatch, sendForm, filterItem, location: {pathname}} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            return dispatch(transactionCreateSendAction(_.get(sendForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filterItem.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: false})})
                })
        },
        handleOpenCashBoxDialog: props => (user, currency, division) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_DIALOG_OPEN]: true,
                    [OPEN_USER]: user,
                    [OPEN_CURRENCY]: currency,
                    [OPEN_DIVISION]: division
                })
            })
        },

        handleCloseCashBoxDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_DIALOG_OPEN]: false,
                    [OPEN_USER]: ZERO,
                    [OPEN_CURRENCY]: ZERO,
                    [OPEN_DIVISION]: ZERO
                })
            })
            dispatch(reset('AcceptClientTransactionForm'))
        },
        handleSubmitCashBoxDialog: props => (amount) => {
            const {dispatch, acceptForm, filter, location: {pathname}} = props
            const cashboxId = _.toInteger(filter.getParam('cashboxId'))
            const data = {
                'currency': _.toInteger(filter.getParam(OPEN_CURRENCY)),
                'agent': _.toInteger(filter.getParam(OPEN_USER)),
                'division': _.toInteger(filter.getParam(OPEN_DIVISION)),
                'amount': _.toNumber(amount),
                'cashbox': _.get(acceptForm, ['values', 'cashBox', 'value']),
                'date': moment(_.get(acceptForm, ['values', 'date'])).format('YYYY-MM-DD HH:mm')
            }
            return dispatch(acceptClientTransactionAction(data))
                .then(() => {
                    dispatch(acceptCashListFetchAction())
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    dispatch(reset('AcceptClientTransactionForm'))
                    dispatch(cashboxListFetchAction(filter))
                    dispatch(transactionListFetchAction(filter, cashboxId))

                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_ACCEPT_DIALOG_OPEN]: false})})
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleOpenAcceptCashDetail: props => (user, currency, division) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]: user + '_' + currency + '_' + division,
                    [OPEN_USER]: user,
                    [OPEN_CURRENCY]: currency,
                    [OPEN_DIVISION]: division
                })
            })
            // Dispatch for this action is in WithPropsOnChange -->> dispatch(pendingTransactionFetchAction(filterItem))
        },
        handleCloseAcceptCashDetail: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]: false})})
        },
        handleCloseTransactionInfoDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_INFO_OPEN]: false})})
        },
        handleOpenTransactionInfoDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_INFO_OPEN]: id})})
        },
        handleOpenSuperUserDialog: props => (id, orderId) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: id, [OPEN_ORDER]: orderId})
            })
        },
        handleCloseSuperUserDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: false, [OPEN_ORDER]: null})})
            dispatch(reset('ClientBalanceCreateForm'))
        },
        handleSubmitSuperUserDialog: props => (id) => {
            const {dispatch, updateForm, filter, filterItem, location: {pathname, query}} = props
            const transId = _.toInteger(_.get(query, TRANSACTION_EDIT_PRICE_OPEN))

            return dispatch(transactionEditPaymentAction(_.get(updateForm, 'values'), id, transId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname, query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: false, [OPEN_ORDER]: null})
                    })
                })
                .then(() => {
                    dispatch(pendingTransactionFetchAction(filterItem))
                    dispatch(acceptCashListFetchAction())
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUpdateTransaction: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname: pathname, query: filter.getParams({[UPDATE_TRANSACTION]: id})})
        },

        handleCloseUpdateTransaction: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[UPDATE_TRANSACTION]: false})})
        },
        handleSubmitUpdateExpenseDialog: props => () => {
            const {dispatch, createForm, filterCashbox, filter, cashboxId, location: {query}} = props
            const transactionId = _.toInteger(_.get(query, UPDATE_TRANSACTION))
            return dispatch(transactionUpdateExpenseAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(transactionItemFetchAction(transactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[UPDATE_TRANSACTION]: false}))
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitUpdateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, cashboxId, location: {query, pathname}, filterCashbox} = props
            const transactionId = _.toInteger(_.get(query, UPDATE_TRANSACTION))
            return dispatch(transactionUpdateIncomeAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_TRANSACTION]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenCategoryPopop: props => (id, key) => {
            const {location: {pathname}, filter} = props
            switch (key) {
                case 'staff_expanse': return hashHistory.push({pathname: pathname, query: filter.getParams({[TRANSACTION_STAFF_EXPENSE_DIALOG]: id})})
                case 'transaction_child': return hashHistory.push({pathname: pathname, query: filter.getParams({[TRANSACTION_DETALIZATION_DIALOG]: id})})
                default: return null
            }
        },

        handleCloseCategoryPopop: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_STAFF_EXPENSE_DIALOG]: false, [TRANSACTION_DETALIZATION_DIALOG]: false})})
        }
    })
)

const TransactionList = enhance((props) => {
    const {
        location,
        list,
        cashboxList,
        cashboxId,
        cashboxListLoading,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        filterItem,
        acceptCashData,
        acceptCashLoading,
        layout,
        params,
        payment,
        paymentLoading,
        transactionInfoLoading,
        transactionInfo,
        isSuperUser,
        openStaff,
        usersList,
        usersListLoading,
        hasMarket,
        categoeyPopopData,
        categoeyPopopDataLoading,
        detalizationList,
        detalizationListLoading,
        optionsList
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', TRANSACTION_FILTER_OPEN]))
    const openCreateExpenseDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]))
    const openCreateIncomeDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_INCOME_DIALOG_OPEN]))
    const openUpdateExpenseDialog = toBoolean(_.get(location, ['query', TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]))
    const openUpdateIncomeDialog = toBoolean(_.get(location, ['query', TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]))
    const openCreateSendDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_SEND_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', TRANSACTION_DELETE_DIALOG_OPEN]))
    const openCashDialog = toBoolean(_.get(location, ['query', TRANSACTION_CASH_DIALOG_OPEN]))
    const openAcceptCashDetail = (_.get(location, ['query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
    const openCashBoxDialog = toBoolean(_.get(location, ['query', TRANSACTION_ACCEPT_DIALOG_OPEN]))
    const openCategoryPopop = _.toInteger(_.get(location, ['query', TRANSACTION_STAFF_EXPENSE_DIALOG]))
    const openDetalizationDialog = _.toInteger(_.get(location, ['query', TRANSACTION_DETALIZATION_DIALOG]))
    const openTransactionInfo = _.toInteger(_.get(location, ['query', TRANSACTION_INFO_OPEN]))
    const openSuperUser = _.toInteger(_.get(location, ['query', TRANSACTION_EDIT_PRICE_OPEN])) > ZERO
    const openDeleteTransaction = _.toInteger(_.get(location, ['query', DELETE_TRANSACTION])) > ZERO
    const openUpdateTransaction = _.toInteger(_.get(location, ['query', UPDATE_TRANSACTION]))
    const categoryExpense = (filter.getParam(TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE))
    const division = (filter.getParam(TRANSACTION_FILTER_KEY.DIVISION))
    const type = (filter.getParam(TRANSACTION_FILTER_KEY.TYPE))
    const client = (filter.getParam(TRANSACTION_FILTER_KEY.CLIENT))
    const staff = (filter.getParam(TRANSACTION_FILTER_KEY.STAFF))
    const withDeleted = toBoolean(filter.getParam(TRANSACTION_FILTER_KEY.WITH_DELETED))
    const fromDate = filter.getParam(TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'transactionId'))
    const currencyId = _.toInteger(filter.getParam(OPEN_CURRENCY))
    const divisionId = _.toInteger(filter.getParam(OPEN_DIVISION))
    const userId = _.toInteger(filter.getParam(OPEN_USER))

    const createExpenseDialog = {
        loading: createLoading,
        open: openCreateExpenseDialog,
        handleOpenDialog: props.handleOpenCreateExpenseDialog,
        handleCloseDialog: props.handleCloseCreateExpenseDialog,
        handleSubmitDialog: props.handleSubmitCreateExpenseDialog
    }
    const updateTransactionDialog = {
        open: openUpdateTransaction,
        handleOpenDialog: props.handleOpenUpdateTransaction,
        handleCloseDialog: props.handleCloseUpdateTransaction,
        handleIncomeSubmit: props.handleSubmitUpdateIncomeDialog,
        handleExpenseSumbit: props.handleSubmitUpdateExpenseDialog
    }

    const createIncomeDialog = {
        loading: createLoading,
        open: openCreateIncomeDialog,
        handleOpenDialog: props.handleOpenCreateIncomeDialog,
        handleCloseDialog: props.handleCloseCreateIncomeDialog,
        handleSubmitDialog: props.handleSubmitCreateIncomeDialog
    }

    const acceptCashDialog = {
        data: _.get(acceptCashData, 'results'),
        loading: acceptCashLoading,
        openAcceptCashDetail,
        handleOpenAcceptCashDetail: props.handleOpenAcceptCashDetail,
        handleCloseAcceptCashDetail: props.handleCloseAcceptCashDetail,
        open: openCashDialog,
        handleOpenCashDialog: props.handleOpenCashDialog,
        handleCloseCashDialog: props.handleCloseCashDialog,
        handleSubmitCashDialog: props.handleSubmitCashDialog,
        userId,
        currencyId
    }
    const createSendDialog = {
        loading: createLoading,
        open: openCreateSendDialog,
        handleOpenDialog: props.handleOpenCreateSendDialog,
        handleCloseDialog: props.handleCloseCreateSendDialog,
        handleSubmitDialog: props.handleSubmitCreateSendDialog
    }

    const MINUS_ONE = -1
    const updateExpenseDialog = {
        initialValues: (() => {
            const clientExpense = _.get(detail, ['clientTransaction', 'client', 'id'])
            const showClients = _.toInteger(clientExpense || ZERO) > ZERO
            let amount = _.toNumber(_.get(detail, 'amount'))
            if (amount < ZERO) {
                amount *= MINUS_ONE
            }
            if (!detailId || openCreateExpenseDialog) {
                return {
                    date: moment().toDate()
                }
            }
            return {
                comment: _.get(detail, 'comment'),
                expanseCategory: {
                    value: _.get(detail, ['expanseCategory', 'id']),
                    text: _.get(detail, ['expanseCategory', 'name'])
                },
                amount: amount,
                custom_rate: _.get(detail, ['clientTransaction', 'customRate']),
                division: {
                    value: _.get(detail, ['division', 'id'])
                },
                showClients: showClients
            }
        })(),
        loading: updateLoading,
        open: openUpdateExpenseDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateExpenseDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateExpenseDialog
    }

    const updateIncomeDialog = {
        initialValues: (() => {
            let amount = _.toNumber(_.get(detail, 'amount'))
            if (amount < ZERO) {
                amount *= MINUS_ONE
            }
            const clientIncome = _.get(detail, ['clientTransaction', 'client', 'id'])
            const showIncomeClients = _.toInteger(clientIncome || ZERO) > ZERO
            if (!detailId || openCreateIncomeDialog) {
                return {
                    date: moment().toDate()
                }
            }

            return {
                comment: _.get(detail, 'comment'),
                amount: amount,
                client: {value: clientIncome},
                showClients: showIncomeClients,
                expanseCategory: {
                    value: _.get(detail, ['expanseCategory', 'id']),
                    text: _.get(detail, ['expanseCategory', 'name'])
                },
                custom_rate: _.get(detail, ['clientTransaction', 'customRate']),
                division: {value: _.get(detail, ['clientTransaction', 'division', 'id'])},
                showIncomeClients: showIncomeClients
            }
        })(),
        loading: updateLoading,
        open: openUpdateIncomeDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateIncomeDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateIncomeDialog
    }

    const confirmDialog = {
        open: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleExpenseConfirmDialog: props.handleExpenseConfirmDialog
    }

    const filterDialog = {
        initialValues: {
            categoryExpense: categoryExpense && splitToArray(categoryExpense),
            type: type && splitToArray(type),
            client: client && splitToArray(client),
            staff: staff && splitToArray(staff),
            division: division && splitToArray(division),
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            },
            with_deleted: withDeleted
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const cashboxData = {
        data: _.get(cashboxList, 'results'),
        handleClickCashbox: props.handleClickCashbox,
        cashboxId: _.toInteger(cashboxId),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    const currentCashBoxDetails = _.find(_.get(acceptCashData, ['results']), (obj) => {
        const objCurrency = _.toInteger(_.get(obj, ['currency', 'id']))
        const objUser = _.toInteger(_.get(obj, ['user', 'id']))
        const objDivision = _.toInteger(_.get(obj, ['division', 'id']))
        return objCurrency === currencyId && objUser === userId && objDivision === divisionId
    })

    const cashBoxDialog = {
        openCashBoxDialog,
        handleOpenCashBoxDialog: props.handleOpenCashBoxDialog,
        handleCloseCashBoxDialog: props.handleCloseCashBoxDialog,
        handleSubmitCashBoxDialog: props.handleSubmitCashBoxDialog
    }
    const paymentData = {
        data: _.get(payment, 'results') || {},
        paymentLoading,
        currentCashBoxDetails,
        currencyId
    }

    const transactionInfoDialog = {
        loading: transactionInfoLoading,
        data: _.get(transactionInfo, 'results') || [],
        open: openTransactionInfo,
        handleOpenDialog: props.handleOpenTransactionInfoDialog,
        handleCloseDialog: props.handleCloseTransactionInfoDialog
    }

    const superUser = {
        isSuperUser,
        open: openSuperUser,
        handleOpenSuperUserDialog: props.handleOpenSuperUserDialog,
        handleCloseSuperUserDialog: props.handleCloseSuperUserDialog,
        handleSubmitSuperUserDialog: props.handleSubmitSuperUserDialog,

        openDelete: openDeleteTransaction,
        handleOpenDeleteTransaction: props.handleOpenDeleteTransaction,
        handleCloseDeleteTransaction: props.handleCloseDeleteTransaction,
        handleSubmitDeleteTransaction: props.handleSubmitDeleteTransaction
    }

    const usersData = {
        open: openStaff,
        data: _.get(usersList, 'results'),
        loading: usersListLoading
    }

    const categryPopop = {
        data: _.get(categoeyPopopData, 'results'),
        loading: categoeyPopopDataLoading,
        open: openCategoryPopop > ZERO,
        handleOpenCategoryPopop: props.handleOpenCategoryPopop,
        handleCloseCategoryPopop: props.handleCloseCategoryPopop
    }

    const detalizationDialog = {
        data: detalizationList,
        loading: detalizationListLoading,
        open: openDetalizationDialog > ZERO,
        handleOpenDialog: props.handleOpenCategoryPopop,
        handleCloseDialog: props.handleCloseCategoryPopop
    }

    const hasRightCashbox = _.find(_.get(cashboxList, 'results'), {'type': 'cash'})
    const canSetCustomRate = checkPermission('can_set_custom_rate')
    return (
        <Layout {...layout}>
            <TransactionGridList
                filter={filter}
                filterItem={filterItem}
                listData={listData}
                cashboxListLoading={cashboxListLoading}
                cashboxData={cashboxData}
                detailData={detailData}
                createExpenseDialog={createExpenseDialog}
                createIncomeDialog={createIncomeDialog}
                updateIncomeDialog={updateIncomeDialog}
                updateExpenseDialog={updateExpenseDialog}
                createSendDialog={createSendDialog}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                paymentData={paymentData}
                cashBoxDialog={cashBoxDialog}
                acceptCashDialog={acceptCashDialog}
                transactionInfoDialog={transactionInfoDialog}
                superUser={superUser}
                hasRightCashbox={hasRightCashbox}
                updateTransactionDialog={updateTransactionDialog}
                usersData={usersData}
                hasMarket={hasMarket}
                canSetCustomRate={canSetCustomRate}
                categryPopop={categryPopop}
                optionsList={optionsList}
                detalizationDialog={detalizationDialog}
            />
        </Layout>
    )
})

export default TransactionList
