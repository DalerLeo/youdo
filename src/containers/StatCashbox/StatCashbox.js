import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    STAT_CASHBOX_CREATE_DIALOG_OPEN,
    STAT_CASHBOX_UPDATE_DIALOG_OPEN,
    STAT_CASHBOX_DELETE_DIALOG_OPEN,
    ORDER_DETAIL_OPEN,
    StatCashboxGridList
} from '../../components/StatCashbox'
import {
    statCashboxCreateAction,
    statCashboxUpdateAction,
    statCashboxListFetchAction,
    statCashboxCSVFetchAction,
    statCashboxDeleteAction,
    statCashboxItemFetchAction
} from '../../actions/statCashbox'
import {orderListFetchAction, orderItemFetchAction} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statCashbox', 'item', 'data'])
        const orderDetail = _.get(state, ['order', 'item', 'data'])
        const detailLoading = _.get(state, ['statCashbox', 'item', 'loading'])
        const createLoading = _.get(state, ['statCashbox', 'create', 'loading'])
        const updateLoading = _.get(state, ['statCashbox', 'update', 'loading'])
        const list = _.get(state, ['statCashbox', 'list', 'data'])
        const orderList = _.get(state, ['order', 'list', 'data'])
        const orderLoading = _.get(state, ['order', 'list', 'loading'])
        const listLoading = _.get(state, ['statCashbox', 'list', 'loading'])
        const csvData = _.get(state, ['statCashbox', 'csv', 'data'])
        const csvLoading = _.get(state, ['statCashbox', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'StatCashboxCreateForm'])
        const orderId = _.toInteger(_.get(['location', 'query', 'orderId']))

        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            orderList,
            orderLoading,
            detail,
            orderDetail,
            orderId,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statCashboxListFetchAction(filter))
        dispatch(orderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statCashboxId = _.get(nextProps, ['params', 'statCashboxId'])
        return statCashboxId && _.get(props, ['params', 'statCashboxId']) !== statCashboxId
    }, ({dispatch, params, filter}) => {
        const statCashboxId = _.toInteger(_.get(params, 'statCashboxId'))
        statCashboxId && dispatch(statCashboxItemFetchAction(statCashboxId))
        dispatch(orderListFetchAction(filter))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(statCashboxCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STAT_CASHBOX_ITEM_PATH, id),
                query: filter.getParams({[STAT_CASHBOX_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(statCashboxDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_DELETE_DIALOG_OPEN]: false})})
                    dispatch(statCashboxListFetchAction(filter))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(statCashboxCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_CREATE_DIALOG_OPEN]: false})})
                    dispatch(statCashboxListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STAT_CASHBOX_ITEM_PATH, id),
                query: filter.getParams({[STAT_CASHBOX_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_CASHBOX_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const statCashboxId = _.toInteger(_.get(props, ['params', 'statCashboxId']))

            return dispatch(statCashboxUpdateAction(statCashboxId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(statCashboxItemFetchAction(statCashboxId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[STAT_CASHBOX_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(statCashboxListFetchAction(filter))
                })
        },
        handleOrderClick: props => (id) => {
            const {filter, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[ORDER_DETAIL_OPEN]: true, 'orderId': id})
            })
            dispatch(orderItemFetchAction(id))
        },

        handleOrderDetailClose: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[ORDER_DETAIL_OPEN]: false, 'orderId': -1})
            })
        }
    })
)

const StatCashbox = enhance((props) => {
    const {
        location,
        list,
        orderList,
        orderLoading,
        orderDetail,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', STAT_CASHBOX_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STAT_CASHBOX_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', STAT_CASHBOX_DELETE_DIALOG_OPEN]))
    const orderDetailOpen = toBoolean(_.get(location, ['query', ORDER_DETAIL_OPEN]))

    const detailId = _.toInteger(_.get(params, 'statCashboxId'))

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
                name: _.get(detail, 'name')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
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

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    const orderData = {
        orderList,
        orderDetail,
        orderLoading,
        orderDetailOpen: orderDetailOpen,
        handleOrderDetailClose: props.handleOrderDetailClose,
        handleOrderClick: props.handleOrderClick
    }

    return (
        <Layout {...layout}>
            <StatCashboxGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                csvDialog={csvDialog}
                orderData={orderData}
            />
        </Layout>
    )
})

export default StatCashbox
