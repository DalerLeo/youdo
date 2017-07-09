import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CASHBOX_CREATE_DIALOG_OPEN,
    CASHBOX_UPDATE_DIALOG_OPEN,
    CASHBOX_DELETE_DIALOG_OPEN,
    CashboxGridList
} from '../../components/Cashbox'
import {
    cashboxCreateAction,
    cashboxUpdateAction,
    cashboxListFetchAction,
    cashboxDeleteAction,
    cashboxItemFetchAction
} from '../../actions/cashbox'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['cashbox', 'item', 'data'])
        const itemLoading = _.get(state, ['cashbox', 'item', 'loading'])
        const createLoading = _.get(state, ['cashbox', 'create', 'loading'])
        const updateLoading = _.get(state, ['cashbox', 'update', 'loading'])
        const list = _.get(state, ['cashbox', 'list', 'data'])
        const listLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'CashboxCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            itemLoading,
            createLoading,
            updateLoading,
            filter,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(cashboxListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const cashboxId = _.get(nextProps, ['params', 'cashboxId'])
        return cashboxId && _.get(props, ['params', 'cashboxId']) !== cashboxId
    }, ({dispatch, params}) => {
        const cashboxId = _.toInteger(_.get(params, 'cashboxId'))
        cashboxId && dispatch(cashboxItemFetchAction(cashboxId))
    }),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CASHBOX_ITEM_PATH, id),
                query: filter.getParams({[CASHBOX_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(cashboxDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CASHBOX_DELETE_DIALOG_OPEN]: false})})
                    dispatch(cashboxListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('StockCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(cashboxCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: false})})
                    dispatch(cashboxListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CASHBOX_ITEM_PATH, id),
                query: filter.getParams({[CASHBOX_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const cashboxId = _.toInteger(_.get(props, ['params', 'cashboxId']))

            return dispatch(cashboxUpdateAction(cashboxId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(cashboxItemFetchAction(cashboxId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CASHBOX_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(cashboxListFetchAction(filter))
                })
        }
    })
)

const CashboxList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        itemLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', CASHBOX_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', CASHBOX_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CASHBOX_DELETE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'cashboxId'))

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
        confirmLoading: itemLoading,
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }

            return {
                name: _.get(detail, 'name'),
                currency: {
                    value: _.get(detail, 'currency')
                },
                cashier: {
                    value: _.get(detail, 'cashier')
                },
                type: {
                    value: _.get(detail, 'type')
                }
            }
        })(),
        updateLoading: itemLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        itemLoading
    }

    return (
        <Layout {...layout}>
            <CashboxGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
            />
        </Layout>
    )
})

export default CashboxList
