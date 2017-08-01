import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {reset} from 'redux-form'
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
    TransactionGridList
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
    pendingTransactionFetchAction
} from '../../actions/transaction'
import {
    cashboxListFetchAction
} from '../../actions/cashbox'
import {openSnackbarAction} from '../../actions/snackbar'

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
        const filterForm = _.get(state, ['form', 'TransactionFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const acceptForm = _.get(state, ['form', 'AcceptClientTransactionForm'])
        const payment = _.get(state, ['cashbox', 'pending', 'data'])
        const paymentLoading = _.get(state, ['cashbox', 'pending', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const filterCashbox = filterHelper(cashboxList, pathname, query)
        const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
        return {
            list,
            cashboxList,
            cashboxListLoading,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterForm,
            filterCashbox,
            paymentLoading,
            cashboxId,
            createForm,
            payment,
            acceptForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return !nextProps.cashboxListLoading && _.isNil(nextProps.cashboxList)
    }, ({dispatch, filterCashbox}) => {
        dispatch(cashboxListFetchAction(filterCashbox))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTransaction = _.get(props, ['location', 'query', TRANSACTION_CASH_DIALOG_OPEN])
        const nextTransaction = _.get(nextProps, ['location', 'query', TRANSACTION_CASH_DIALOG_OPEN])
        return prevTransaction !== nextTransaction && nextTransaction === 'true'
    }, ({dispatch}) => {
        dispatch(pendingTransactionFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (_.get(props, ['location', 'query', 'cashboxId']) !== _.get(nextProps, ['location', 'query', 'cashboxId']))
    }, ({dispatch, filter, location}) => {
        const cashboxId = _.get(location, ['query', 'cashboxId'])
        dispatch(transactionListFetchAction(filter, cashboxId))
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
            const {dispatch, detail, filter, location: {pathname}, cashboxId} = props
            dispatch(transactionDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_DELETE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
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
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense', 'value']) || null

            filter.filterBy({
                [TRANSACTION_FILTER_OPEN]: false,
                [TRANSACTION_FILTER_KEY.TYPE]: type,
                [TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE]: categoryExpense,
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
            const {dispatch, createForm, filter, location: {pathname}, cashboxId} = props
            return dispatch(transactionCreateExpenseAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
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
            const {dispatch, createForm, filter, location: {pathname}, cashboxId} = props
            return dispatch(transactionCreateIncomeAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
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
            const {dispatch, createForm, filter, location: {pathname}} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            return dispatch(transactionCreateSendAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter, cashboxId))
                    dispatch(cashboxListFetchAction(filter))
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

        handleSubmitUpdateExpenseDialog: props => () => {
            const {dispatch, createForm, filter, cashboxId} = props
            const transactionId = _.toInteger(_.get(props, ['params', 'transactionId']))
            return dispatch(transactionUpdateExpenseAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(transactionItemFetchAction(transactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false}))
                    dispatch(transactionListFetchAction(filter, cashboxId))
                })
        },

        handleCloseUpdateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, cashboxId} = props
            const transactionId = _.toInteger(_.get(props, ['params', 'transactionId']))
            return dispatch(transactionUpdateIncomeAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(transactionItemFetchAction(transactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false}))
                    dispatch(transactionListFetchAction(filter, cashboxId))
                })
        },

        handleOpenCashDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: true})})
        },

        handleCloseCashDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: false})})
        },

        handleSubmitCashDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props
            const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
            return dispatch(transactionCreateSendAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CASH_DIALOG_OPEN]: false})})
                })
        },
        handleOpenCashBoxDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_ACCEPT_DIALOG_OPEN]: id})})
        },

        handleCloseCashBoxDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_ACCEPT_DIALOG_OPEN]: false})})
        },
        handleSubmitCashBoxDialog: props => () => {
            const {dispatch, acceptForm, filter, location: {pathname, query}} = props
            const clientTransId = _.toInteger(_.get(query, [TRANSACTION_ACCEPT_DIALOG_OPEN]))
            return dispatch(acceptClientTransactionAction(_.get(acceptForm, ['values', 'cashBox', 'value']), clientTransId))

                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_ACCEPT_DIALOG_OPEN]: false})})
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
        layout,
        params,
        payment,
        paymentLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', TRANSACTION_FILTER_OPEN]))
    const openCreateExpenseDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]))
    const openCreateIncomeDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_INCOME_DIALOG_OPEN]))
    const openUpdateExpenseDialog = toBoolean(_.get(location, ['query', TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]))
    const openUpdateIncomeDialog = toBoolean(_.get(location, ['query', TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]))
    const openCreateSendDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_SEND_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', TRANSACTION_DELETE_DIALOG_OPEN]))
    const openCashDialog = toBoolean(_.get(location, ['query', TRANSACTION_CASH_DIALOG_OPEN]))
    const openCashBoxDialog = _.toInteger(_.get(location, ['query', TRANSACTION_ACCEPT_DIALOG_OPEN]))

    const categoryExpense = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE))
    const type = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.TYPE))
    const fromDate = filter.getParam(TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'transactionId'))

    const createExpenseDialog = {
        loading: createLoading,
        open: openCreateExpenseDialog,
        handleOpenDialog: props.handleOpenCreateExpenseDialog,
        handleCloseDialog: props.handleCloseCreateExpenseDialog,
        handleSubmitDialog: props.handleSubmitCreateExpenseDialog
    }

    const createIncomeDialog = {
        loading: createLoading,
        open: openCreateIncomeDialog,
        handleOpenDialog: props.handleOpenCreateIncomeDialog,
        handleCloseDialog: props.handleCloseCreateIncomeDialog,
        handleSubmitDialog: props.handleSubmitCreateIncomeDialog
    }

    const createSendDialog = {
        loading: createLoading,
        open: openCreateSendDialog,
        handleOpenDialog: props.handleOpenCreateSendDialog,
        handleCloseDialog: props.handleCloseCreateSendDialog,
        handleSubmitDialog: props.handleSubmitCreateSendDialog
    }

    const updateExpenseDialog = {
        initialValues: (() => {
            if (!detailId || openCreateExpenseDialog) {
                return {}
            }
            return {
                comment: _.get(detail, 'comment'),
                expanseCategory: {
                    value: _.get(detail, ['expanseCategory', 'id']),
                    text: _.get(detail, ['expanseCategory', 'name'])
                },
                amount: _.get(detail, 'amount')
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
            if (!detailId || openCreateIncomeDialog) {
                return {}
            }

            return {
                comment: _.get(detail, 'comment'),
                amount: _.get(detail, 'amount')
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

    const cashDialog = {
        open: openCashDialog,
        handleOpenCashDialog: props.handleOpenCashDialog,
        handleCloseCashDialog: props.handleCloseCashDialog,
        handleSubmitCashDialog: props.handleSubmitCashDialog
    }

    const filterDialog = {
        initialValues: {
            category: {
                value: categoryExpense
            },
            type: {
                value: type
            },
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            }
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

    const currentCashBoxDetails = _.find(_.get(payment, ['results']), {'id': openCashBoxDialog})

    const cashBoxDialog = {
        openCashBoxDialog,
        handleOpenCashBoxDialog: props.handleOpenCashBoxDialog,
        handleCloseCashBoxDialog: props.handleCloseCashBoxDialog,
        handleSubmitCashBoxDialog: props.handleSubmitCashBoxDialog
    }
    const paymentData = {
        data: payment,
        paymentLoading,
        currentCashBoxDetails
    }

    return (
        <Layout {...layout}>
            <TransactionGridList
                filter={filter}
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
                cashDialog={cashDialog}
                filterDialog={filterDialog}
                paymentData={paymentData}
                cashBoxDialog={cashBoxDialog}
            />
        </Layout>
    )
})

export default TransactionList
