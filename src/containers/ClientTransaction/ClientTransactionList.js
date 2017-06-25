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
import {
    CLIENT_TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN,
    CLIENT_TRANSACTION_CREATE_INCOME_DIALOG_OPEN,
    CLIENT_TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN,
    CLIENT_TRANSACTION_UPDATE_INCOME_DIALOG_OPEN,
    CLIENT_TRANSACTION_CREATE_SEND_DIALOG_OPEN,
    CLIENT_TRANSACTION_DELETE_DIALOG_OPEN,
    CLIENT_TRANSACTION_FILTER_KEY,
    CLIENT_TRANSACTION_FILTER_OPEN,
    ClientTransactionGridList
} from '../../components/ClientTransaction'
import {
    clientTransactionCreateExpenseAction,
    clientTransactionCreateIncomeAction,
    clientTransactionUpdateExpenseAction,
    clientTransactionUpdateIncomeAction,
    clientTransactionCreateSendAction,
    clientTransactionListFetchAction,
    clientTransactionCSVFetchAction,
    clientTransactionDeleteAction,
    clientTransactionItemFetchAction
} from '../../actions/clientTransaction'
import {
    clientListFetchAction
} from '../../actions/client'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['clientTransaction', 'item', 'data'])
        const detailLoading = _.get(state, ['clientTransaction', 'item', 'loading'])
        const createLoading = _.get(state, ['clientTransaction', 'create', 'loading'])
        const updateLoading = _.get(state, ['clientTransaction', 'update', 'loading'])
        const list = _.get(state, ['clientTransaction', 'list', 'data'])
        const clientList = _.get(state, ['client', 'list', 'data'])
        const clientListLoading = _.get(state, ['client', 'list', 'loading'])
        const listLoading = _.get(state, ['clientTransaction', 'list', 'loading'])
        const csvData = _.get(state, ['clientTransaction', 'csv', 'data'])
        const csvLoading = _.get(state, ['clientTransaction', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientTransactionFilterForm'])
        const createForm = _.get(state, ['form', 'ClientTransactionCreateForm'])
        const filter = filterHelper(list, pathname, query)
        const filterClient = filterHelper(clientList, pathname, query)
        return {
            list,
            clientList,
            clientListLoading,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterClient,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (!nextProps.clientListLoading && _.isNil(nextProps.clientList)) ||
            (props.filterClient.filterRequest() !== nextProps.filterClient.filterRequest())
    }, ({dispatch, filterClient}) => {
        dispatch(clientListFetchAction(filterClient))
    }),

    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (_.get(props, ['params', 'clientTransactionId']) !== _.get(nextProps, ['params', 'clientTransactionId']))
    }, ({dispatch, filter, params}) => {
        const clientId = _.toInteger(_.get(params, 'clientTransactionId'))
        dispatch(clientTransactionListFetchAction(filter, clientId === ZERO ? null : clientId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenDeleteDialog: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(clientTransactionCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})})
        },
        handleExpenseConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}, clientId} = props
            dispatch(clientTransactionDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_FILTER_OPEN]: false})})
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
                [CLIENT_TRANSACTION_FILTER_OPEN]: false,
                [CLIENT_TRANSACTION_FILTER_KEY.TYPE]: type,
                [CLIENT_TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE]: categoryExpense,
                [CLIENT_TRANSACTION_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CLIENT_TRANSACTION_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCreateExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: true})
            })
        },

        handleCloseCreateExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})
            })
        },

        handleSubmitCreateExpenseDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, params} = props
            const clientId = _.get(params, 'clientTransactionId')
            return dispatch(clientTransactionCreateExpenseAction(_.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                })
        },

        handleOpenCreateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: true})
            })
        },

        handleCloseCreateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})
            })
        },

        handleSubmitCreateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, params} = props
            const clientId = _.get(params, 'clientTransactionId')
            return dispatch(clientTransactionCreateIncomeAction(_.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_CREATE_INCOME_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                })
        },

        handleOpenCreateSendDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_CREATE_SEND_DIALOG_OPEN]: true})})
        },

        handleCloseCreateSendDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateSendDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, clientId} = props
            return dispatch(clientTransactionCreateSendAction(_.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_CREATE_SEND_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter))
                    dispatch(clientListFetchAction(filter))
                })
        },

        handleClickClient: props => (id) => {
            hashHistory.push({pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, _.toInteger(id)), query: {}})
        },

        handleOpenUpdateDialog: props => (id, amount) => {
            const {filter, dispatch} = props
            const zero = 0
            if (_.toNumber(amount) < zero) {
                hashHistory.push({
                    pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                    query: filter.getParams({[CLIENT_TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: true})
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                    query: filter.getParams({[CLIENT_TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: true})
                })
            }
            dispatch(clientTransactionItemFetchAction(id))
        },

        handleCloseUpdateExpenseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false})
            })
        },

        handleSubmitUpdateExpenseDialog: props => () => {
            const {dispatch, createForm, filter, clientId} = props
            const clientTransactionId = _.toInteger(_.get(props, ['params', 'clientTransactionId']))
            return dispatch(clientTransactionUpdateExpenseAction(clientTransactionId, _.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(clientTransactionItemFetchAction(clientTransactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CLIENT_TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]: false}))
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                })
        },

        handleCloseUpdateIncomeDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false})
            })
        },

        handleSubmitUpdateIncomeDialog: props => () => {
            const {dispatch, createForm, filter, clientId} = props
            const clientTransactionId = _.toInteger(_.get(props, ['params', 'clientTransactionId']))
            return dispatch(clientTransactionUpdateIncomeAction(clientTransactionId, _.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(clientTransactionItemFetchAction(clientTransactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CLIENT_TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]: false}))
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                })
        }
    })
)

const ClientTransactionList = enhance((props) => {
    const {
        location,
        list,
        clientList,
        clientListLoading,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        filterClient,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_FILTER_OPEN]))
    const openCreateExpenseDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_CREATE_EXPENSE_DIALOG_OPEN]))
    const openCreateIncomeDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_CREATE_INCOME_DIALOG_OPEN]))
    const openUpdateExpenseDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_UPDATE_EXPENSE_DIALOG_OPEN]))
    const openUpdateIncomeDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_UPDATE_INCOME_DIALOG_OPEN]))
    const openCreateSendDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_CREATE_SEND_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]))

    const categoryExpense = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE))
    const type = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.TYPE))
    const fromDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'clientTransactionId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

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
            if (!detailId) {
                return {}
            }
            return {
                comment: _.get(detail, 'comment'),
                category: {
                    value: _.get(detail, ['expanseCategory', 'id'])
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
            if (!detailId) {
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

    const clientData = {
        data: _.get(clientList, 'results'),
        handleClickClient: props.handleClickClient,
        clientId: _.toInteger(detailId),
        listLoading

    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ClientTransactionGridList
                filterClient={filterClient}
                filter={filter}
                listData={listData}
                clientListLoading={clientListLoading}
                clientData={clientData}
                detailData={detailData}
                createExpenseDialog={createExpenseDialog}
                createIncomeDialog={createIncomeDialog}
                updateIncomeDialog={updateIncomeDialog}
                updateExpenseDialog={updateExpenseDialog}
                createSendDialog={createSendDialog}
                confirmDialog={confirmDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ClientTransactionList
