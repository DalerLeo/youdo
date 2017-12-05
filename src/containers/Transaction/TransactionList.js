import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {reset, change} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
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
    TransactionGridList,
    TRANSACTION_ACCEPT_CASH_DETAIL_OPEN,
    TRANSACTION_INFO_OPEN,
    TRANSACTION_EDIT_PRICE_OPEN
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
    transactionConvertAction
} from '../../actions/transaction'
import {
    cashboxListFetchAction
} from '../../actions/cashbox'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

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
        const listLoading = _.get(state, ['transaction', 'list', 'loading'])
        const transactionInfo = _.get(state, ['transaction', 'info', 'data'])
        const transactionInfoLoading = _.get(state, ['transaction', 'info', 'loading'])
        const filterForm = _.get(state, ['form', 'TransactionFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const acceptForm = _.get(state, ['form', 'AcceptClientTransactionForm'])
        const updateForm = _.get(state, ['form', 'ClientBalanceUpdateForm'])
        const payment = _.get(state, ['cashbox', 'pending', 'data'])
        const acceptCashData = _.get(state, ['transaction', 'acceptCash', 'data'])
        const acceptCashLoading = _.get(state, ['transaction', 'acceptCash', 'loading'])
        const paymentLoading = _.get(state, ['cashbox', 'pending', 'loading'])
        const filterCashbox = filterHelper(cashboxList, pathname, query)
        const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])

        const date = _.get(state, ['form', 'TransactionCreateForm', 'values', 'date'])
        const cashbox = _.get(state, ['form', 'TransactionCreateForm', 'values', 'cashbox', 'value', 'id'])
        const convertAmount = _.get(state, ['pendingPayments', 'convert', 'data', 'amount'])

        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(payment, pathname, query, {'page': 'dPage'})
        return {
            list,
            query,
            cashboxList,
            cashboxListLoading,
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
            payment,
            acceptForm,
            transactionInfo,
            transactionInfoLoading,
            isSuperUser,
            updateForm,
            date,
            cashbox,
            convertAmount
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.cashboxListLoading && _.isNil(nextProps.cashboxList)
    }, ({dispatch, filterCashbox}) => {
        dispatch(cashboxListFetchAction(filterCashbox))
    }),

    withPropsOnChange((props, nextProps) => {
        return (props.date !== nextProps.date && nextProps.date) || (props.cashbox !== nextProps.cashbox && nextProps.cashbox)
    }, ({dispatch, date, cashbox, cashboxList}) => {
        const currency = _.get(_.find(_.get(cashboxList, 'results'), {'id': cashbox}), ['currency', 'id'])
        if (date && cashbox) {
            dispatch(transactionConvertAction(date, currency))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.convertAmount !== nextProps.convertAmount && nextProps.convertAmount
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
            updateTransaction: null
        }
        const prevCashDetails = (_.get(props, ['location', 'query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        const nextCashDetails = (_.get(nextProps, ['location', 'query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        return (prevCashDetails !== nextCashDetails || ((props.filterItem.filterRequest(except) !== nextProps.filterItem.filterRequest(except)))) && nextCashDetails !== 'false'
    }, ({dispatch, location, filterItem}) => {
        const cashDetails = (_.get(location, ['query', TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]))
        const user = _.get(location, ['query', 'openUser'])
        const currency = _.get(location, ['query', 'openCurrency'])
        cashDetails && dispatch(pendingTransactionFetchAction(user, currency, filterItem))
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            updateTransaction: null
        }
        return (props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except) && _.isNil(nextProps.query.dPage || nextProps.query.dPageSize || props.query.dPage || props.query.dPageSize)) ||
            (_.get(props, ['location', 'query', 'cashboxId']) !== _.get(nextProps, ['location', 'query', 'cashboxId']))
    }, ({dispatch, filter, location, isSuperUser}) => {
        const cashboxId = _.get(location, ['query', 'cashboxId'])
        dispatch(transactionListFetchAction(filter, cashboxId, isSuperUser))
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
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    dispatch(cashboxListFetchAction(filterCashbox))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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
            const currency = _.toInteger(_.get(query, 'openCurrency'))
            const user = _.toInteger(_.get(query, 'openUser'))
            dispatch(deleteTransactionAction(transactionId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[DELETE_TRANSACTION]: false})})
                    dispatch(pendingTransactionFetchAction(user, currency, filterItem))
                    dispatch(acceptCashListFetchAction())
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const withDeleted = _.get(filterForm, ['values', 'with_deleted']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense']) || null

            filter.filterBy({
                [TRANSACTION_FILTER_OPEN]: false,
                [TRANSACTION_FILTER_KEY.TYPE]: type,
                [TRANSACTION_FILTER_KEY.CLIENT]: _.join(client, '-'),
                [TRANSACTION_FILTER_KEY.WITH_DELETED]: withDeleted,
                [TRANSACTION_FILTER_KEY.DIVISION]: _.join(division, '-'),
                [TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE]: _.join(categoryExpense, '-'),
                [TRANSACTION_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [TRANSACTION_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCreateExpenseDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: true})})
            dispatch(reset('TransactionCreateForm'))
        },

        handleCloseCreateExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateExpenseDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, cashboxId, filterCashbox} = props
            return dispatch(transactionCreateExpenseAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
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
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: true})})
            dispatch(reset('TransactionCreateForm'))
        },

        handleCloseCreateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, cashboxId, filterCashbox} = props
            return dispatch(transactionCreateIncomeAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
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
            dispatch(reset('TransactionCreateForm'))
        },

        handleCloseCreateSendDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateSendDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, filterCashbox, cashboxList} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            const cashbox = _.find(_.get(cashboxList, 'results'), {'id': _.toInteger(cashboxId)})
            const chosenCashbox = _.find(_.get(cashboxList, 'results'), {'id': _.toInteger(_.get(createForm, ['values', 'categoryId', 'value']))})
            const withPersent = _.get(cashbox, ['currency', 'name']) === _.get(chosenCashbox, ['currency', 'name']) && _.get(cashbox, 'type') !== _.get(chosenCashbox, 'type')
            return dispatch(transactionCreateSendAction(_.get(createForm, ['values']), cashboxId, withPersent))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
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

        handleClickCashbox: props => (id) => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {'cashboxId': id}})
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false})})
        },
        handleCloseUpdateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
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
            const {dispatch, createForm, filterItem, location: {pathname}} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            return dispatch(transactionCreateSendAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filterItem.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: false})})
                })
        },
        handleOpenCashBoxDialog: props => (user, currency) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_DIALOG_OPEN]: true,
                    'openUser': user,
                    'openCurrency': currency
                })
            })
        },

        handleCloseCashBoxDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_DIALOG_OPEN]: false,
                    'openUser': ZERO,
                    'openCurrency': ZERO
                })
            })
            dispatch(reset('AcceptClientTransactionForm'))
        },
        handleSubmitCashBoxDialog: props => (amount) => {
            const {dispatch, acceptForm, filter, location: {pathname}} = props
            const cashboxId = _.toInteger(filter.getParam('cashboxId'))
            const data = {
                'currency': _.toInteger(filter.getParam('openCurrency')),
                'agent': _.toInteger(filter.getParam('openUser')),
                'amount': _.toNumber(amount),
                'cashbox': _.get(acceptForm, ['values', 'cashBox', 'value'])
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
        handleOpenAcceptCashDetail: props => (user, currency) => {
            const {filter, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({
                    [TRANSACTION_ACCEPT_CASH_DETAIL_OPEN]: user + '_' + currency,
                    'openUser': user,
                    'openCurrency': currency
                })
            })
            dispatch(pendingTransactionFetchAction(user, currency))
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
        handleOpenSuperUserDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: id})
            })
        },
        handleCloseSuperUserDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: false})})
            dispatch(reset('ClientBalanceCreateForm'))
        },
        handleSubmitSuperUserDialog: props => (id) => {
            const {dispatch, updateForm, filter, filterItem, location: {pathname, query}} = props
            const currency = _.toInteger(_.get(query, 'openCurrency'))
            const user = _.toInteger(_.get(query, 'openUser'))
            const transId = _.toInteger(_.get(query, TRANSACTION_EDIT_PRICE_OPEN))

            return dispatch(transactionEditPaymentAction(_.get(updateForm, 'values'), id, transId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname, query: filter.getParams({[TRANSACTION_EDIT_PRICE_OPEN]: false})
                    })
                })
                .then(() => {
                    dispatch(pendingTransactionFetchAction(user, currency, filterItem))
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
            const {dispatch, createForm, filter, cashboxId, location: {query}} = props
            const transactionId = _.toInteger(_.get(query, UPDATE_TRANSACTION))
            return dispatch(transactionUpdateExpenseAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(transactionItemFetchAction(transactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[UPDATE_TRANSACTION]: false}))
                    dispatch(transactionListFetchAction(filter, cashboxId))
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
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
        isSuperUser
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
    const openTransactionInfo = _.toInteger(_.get(location, ['query', TRANSACTION_INFO_OPEN]))
    const openSuperUser = _.toInteger(_.get(location, ['query', TRANSACTION_EDIT_PRICE_OPEN])) > ZERO
    const openDeleteTransaction = _.toInteger(_.get(location, ['query', DELETE_TRANSACTION])) > ZERO
    const openUpdateTransaction = _.toInteger(_.get(location, ['query', UPDATE_TRANSACTION]))
    const categoryExpense = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE))
    const division = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.DIVISION))
    const type = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.TYPE))
    const client = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.CLIENT))
    const withDeleted = toBoolean(filter.getParam(TRANSACTION_FILTER_KEY.WITH_DELETED))
    const fromDate = filter.getParam(TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'transactionId'))
    const currencyId = _.toInteger(filter.getParam('openCurrency'))
    const userId = _.toInteger(filter.getParam('openUser'))

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
                return {}
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
                    date: moment()
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
            category: categoryExpense && _.map(_.split(categoryExpense, '-'), (item) => {
                return _.toNumber(item)
            }),
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            division: division && _.map(_.split(division, '-'), (item) => {
                return _.toNumber(item)
            }),
            type: {
                value: type
            },
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
        return _.toNumber(_.get(obj, ['currency', 'id'])) === currencyId && _.toNumber(_.get(obj, ['user', 'id'])) === userId
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

    const hasRightCashbox = _.find(_.get(cashboxList, 'results'), {'type': 'cash'})
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
            />
        </Layout>
    )
})

export default TransactionList
