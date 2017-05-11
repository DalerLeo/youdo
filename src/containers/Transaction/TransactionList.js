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
    TRANSACTION_CREATE_DIALOG_OPEN,
    TRANSACTION_UPDATE_DIALOG_OPEN,
    TRANSACTION_DELETE_DIALOG_OPEN,
    TRANSACTION_FILTER_KEY,
    TRANSACTION_FILTER_OPEN,
    TransactionGridList
} from '../../components/Transaction'
import {
    transactionCreateAction,
    transactionUpdateAction,
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
        const createLoading = _.get(state, ['transaction', 'create', 'loading'])
        const updateLoading = _.get(state, ['transaction', 'update', 'loading'])
        const list = _.get(state, ['transaction', 'list', 'data'])
        const cashboxList = _.get(state, ['cashbox', 'list', 'data'])
        const cashboxListLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const listLoading = _.get(state, ['transaction', 'list', 'loading'])
        const csvData = _.get(state, ['transaction', 'csv', 'data'])
        const csvLoading = _.get(state, ['transaction', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'TransactionFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const filter = filterHelper(list, pathname, query)
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
            csvData,
            csvLoading,
            filter,
            filterForm,
            cashboxId,
            createForm
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

        handleOpenDeleteDialog: props => () => {
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
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(transactionDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_DELETE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter))
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

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, cashboxId} = props
            return dispatch(transactionCreateAction(_.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CREATE_DIALOG_OPEN]: false})})
                    dispatch(transactionListFetchAction(filter))
                })
        },

        handleClickCashbox: props => (id) => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({'cashboxId': id})})
            dispatch(transactionListFetchAction(filter))
        },

        handleOpenUpdateDialog: props => (id, type) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.TRANSACTION_ITEM_PATH, id),
                query: filter.getParams({[TRANSACTION_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, cashboxId} = props
            const transactionId = _.toInteger(_.get(props, ['params', 'transactionId']))
            return dispatch(transactionUpdateAction(transactionId, _.get(createForm, ['values']), cashboxId))
                .then(() => {
                    return dispatch(transactionItemFetchAction(transactionId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[TRANSACTION_UPDATE_DIALOG_OPEN]: false}))
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
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', TRANSACTION_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', TRANSACTION_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', TRANSACTION_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', TRANSACTION_DELETE_DIALOG_OPEN]))

    const category = _.toInteger(filter.getParam(TRANSACTION_FILTER_KEY.CATEGORY))
    const fromDate = filter.getParam(TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'transactionId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
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
        openUpdateDialog,
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
                createDialog={createDialog}
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
