import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    TRANSACTION_EXPENSE_DIALOG_OPEN,
    TRANSACTION_INCOME_DIALOG_OPEN,
    TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN,
    TRANSACTION_UPDATE_INCOME_DIALOG_OPEN,
    TRANSACTION_FILTER_KEY,
    TRANSACTION_FILTER_OPEN,
    TransactionGridList
} from '../../components/Transaction'
import {
    transactionExpenseAction,
    transactionIncomeAction,
    transactionUpdateExpenseAction,
    transactionUpdateIncomeAction,
    transactionListFetchAction,
    transactionCSVFetchAction,
    transactionDeleteAction,
    transactionItemFetchAction
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
        const expenseLoading = _.get(state, ['transaction', 'create', 'loading'])
        const incomeLoading = _.get(state, ['transaction', 'create', 'loading'])
        const updateLoading = _.get(state, ['transaction', 'update', 'loading'])
        const list = _.get(state, ['transaction', 'list', 'data'])
        const cashboxList = _.get(state, ['cashbox', 'list', 'data'])
        const cashboxListLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const listLoading = _.get(state, ['transaction', 'list', 'loading'])
        const csvData = _.get(state, ['transaction', 'csv', 'data'])
        const csvLoading = _.get(state, ['transaction', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'TransactionFilterForm'])
        const expenseForm = _.get(state, ['form', 'TransactionExpenseForm'])
        const incomeForm = _.get(state, ['form', 'TransactionIncomeForm'])
        const filter = filterHelper(list, pathname, query)
        const cashboxId = _.get(props, ['location', 'query', 'cashboxId'])
        return {
            list,
            cashboxList,
            cashboxListLoading,
            listLoading,
            detail,
            detailLoading,
            expenseLoading,
            incomeLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterForm,
            cashboxId,
            expenseForm,
            incomeForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(transactionListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.cashboxListLoading && _.isNil(nextProps.cashboxList)
    }, ({dispatch}) => {
        dispatch(cashboxListFetchAction())
    }),
    withPropsOnChange((props, nextProps) => {
        const transactionId = _.get(nextProps, ['params', 'transactionId'])
        return transactionId && _.get(props, ['params', 'transactionId']) !== transactionId
    }, ({dispatch, params}) => {
        const transactionId = _.toInteger(_.get(params, 'transactionId'))
        transactionId && dispatch(transactionItemFetchAction(transactionId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(transactionCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog} = props
            dispatch(transactionDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
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
            const category = _.get(filterForm, ['values', 'category', 'value']) || null

            filter.filterBy({
                [TRANSACTION_FILTER_OPEN]: false,
                [TRANSACTION_FILTER_KEY.CATEGORY]: category,
                [TRANSACTION_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [TRANSACTION_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },
        handleOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleOpenExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_EXPENSE_DIALOG_OPEN]: true})})
        },

        handleCloseExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_EXPENSE_DIALOG_OPEN]: false})})
        },

        handleSubmitExpenseDialog: props => () => {
            const {dispatch, expenseForm, filter, location: {pathname}, cashboxId} = props

            return dispatch(transactionExpenseAction(_.get(expenseForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_EXPENSE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(cashboxId))
                })
        },

        handleOpenIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_INCOME_DIALOG_OPEN]: true})})
        },

        handleCloseIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_INCOME_DIALOG_OPEN]: false})})
        },

        handleSubmitIncomeDialog: props => () => {
            const {dispatch, incomeForm, filter, location: {pathname}, cashboxId} = props

            return dispatch(transactionIncomeAction(_.get(incomeForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_INCOME_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(cashboxId))
                })
        },

        handleClickCashbox: props => (id) => {
            const {location: {pathname}, filter, cashboxId, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({'cashboxId': id})})
            dispatch(transactionListFetchAction(cashboxId))
        },

        handleOpenUpdateDialog: props => (id, type) => {
            const {filter} = props
            if (type === 1) {
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
        },

        handleCloseUpdateDialog: props => () => {
            const {detail, location: {pathname}, filter} = props
            if (detail.amount < 0) {
                hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false})})
            } else {
                hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false})})
            }
        },

        handleSubmitUpdateDialog: props => () => {
            const {detail, dispatch, expenseForm, incomeForm, filter} = props
            const transactionId = _.toInteger(_.get(props, ['params', 'transactionId']))
            if (detail.amount < 0) {
                return dispatch(transactionUpdateExpenseAction(transactionId, _.get(expenseForm, ['values'])))
                    .then(() => {
                        return dispatch(transactionItemFetchAction(transactionId))
                    })
                    .then(() => {
                        return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    })
                    .then(() => {
                        hashHistory.push(filter.createURL({[TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false}))
                        dispatch(transactionListFetchAction(filter))
                    })
            }
            return dispatch(transactionUpdateIncomeAction(transactionId, _.get(incomeForm, ['values'])))
                    .then(() => {
                        return dispatch(transactionItemFetchAction(transactionId))
                    })
                    .then(() => {
                        return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    })
                    .then(() => {
                        hashHistory.push(filter.createURL({[TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false}))
                        dispatch(transactionListFetchAction(filter))
                    })
        }
    })
)

const TransactionList = enhance((props) => {
    const {
        location,
        list,
        cashboxList,
        cashboxListLoading,
        listLoading,
        detail,
        detailLoading,
        expenseLoading,
        incomeLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', TRANSACTION_FILTER_OPEN]))
    const openExpenseDialog = toBoolean(_.get(location, ['query', TRANSACTION_EXPENSE_DIALOG_OPEN]))
    const openIncomeDialog = toBoolean(_.get(location, ['query', TRANSACTION_INCOME_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.CATEGORY))
    const fromDate = filter.getParam(TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'transactionId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const expenseDialog = {
        expenseLoading,
        openExpenseDialog,
        handleOpenExpenseDialog: props.handleOpenExpenseDialog,
        handleCloseExpenseDialog: props.handleCloseExpenseDialog,
        handleSubmitExpenseDialog: props.handleSubmitExpenseDialog
    }

    const incomeDialog = {
        incomeLoading,
        openIncomeDialog,
        handleOpenIncomeDialog: props.handleOpenIncomeDialog,
        handleCloseIncomeDialog: props.handleCloseIncomeDialog,
        handleSubmitIncomeDialog: props.handleSubmitIncomeDialog
    }

    const deleteDialog = {
        openDeleteDialog,
        handleOpenDeleteDialog: props.handleOpenDeleteDialog,
        handleCloseDeleteDialog: props.handleCloseDeleteDialog
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }

            return {
                comment: _.get(detail, 'comment'),
                category: {
                    value: _.get(detail, 'category')
                },
                amount: _.get(detail, 'amount')

            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog: _.get(detail, 'amount') < 0 ? openExpenseDialog : openIncomeDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            category: {
                value: category
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

    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const cashboxData = {
        data: _.get(cashboxList, 'results'),
        handleClickCashbox: props.handleClickCashbox,
        cashboxId: _.toInteger(props.cashboxId),
        listLoading

    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <TransactionGridList
                filter={filter}
                listData={listData}
                cashboxListLoading={cashboxListLoading}
                cashboxData={cashboxData}
                detailData={detailData}
                expenseDialog={expenseDialog}
                incomeDialog={incomeDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default TransactionList
