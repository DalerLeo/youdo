import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'
import moment from 'moment'
import TabTransfer from '../../components/StockReceive/StockTabTransfer'
import {OrderPrint} from '../../components/Order'
import {
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    TAB,
    STOCK_CONFIRM_DIALOG_OPEN,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockTransferItemAcceptAction,
    stockReceiveItemConfirmAction,
    stockReceiveItemReturnAction,
    stockReceiveDeliveryConfirmAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const TYPE = 'openType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockTransfer', 'list', 'data'])
        const listLoading = _.get(state, ['stockTransfer', 'list', 'loading'])
        const detail = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const filterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            printList,
            printLoading,
            historyFilterForm,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(stockTransferListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockTransferId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockTransferId']))
        return prevId !== nextId
    }, ({dispatch, params}) => {
        const stockTransferId = _.toInteger(_.get(params, 'stockTransferId'))
        dispatch(stockTransferItemFetchAction(stockTransferId))
    }),

    withState('openPrint', 'setOpenPrint', false),

    withHandlers({
        handleOpenPrintDialog: props => (id) => {
            const {setOpenPrint, dispatch, filter} = props
            setOpenPrint(true)
            dispatch(orderListPintFetchAction(filter, id))
                .then(() => {
                    window.print()
                })
        },

        handleClosePrintDialog: props => () => {
            const {setOpenPrint} = props
            setOpenPrint(false)
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[HISTORY_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[HISTORY_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname, query}} = props
            const currentTab = _.get(query, 'tab') || 'receive'
            hashHistory.push({pathname, query: {[TAB]: currentTab}})
        },

        handleSubmitTabReceiveFilterDialog: props => () => {
            const {filter, filterForm} = props
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const acceptanceFromData = _.get(filterForm, ['values', 'acceptanceDate', 'fromDate']) || null
            const acceptanceToDate = _.get(filterForm, ['values', 'acceptanceDate', 'toDate']) || null
            filter.filterBy({
                [HISTORY_FILTER_OPEN]: false,
                [TAB_TRANSFER_FILTER_KEY.STOCK]: stock,
                [TAB_TRANSFER_FILTER_KEY.TYPE]: type,
                [TAB_TRANSFER_FILTER_KEY.ACCEPTANCE_FROM_DATE]: acceptanceFromData && moment(acceptanceFromData).format('YYYY-MM-DD'),
                [TAB_TRANSFER_FILTER_KEY.ACCEPTANCE_TO_DATE]: acceptanceToDate && moment(acceptanceToDate).format('YYYY-MM-DD'),
                [TAB_TRANSFER_FILTER_KEY.FROM_DATE]: fromDate && moment(fromDate).format('YYYY-MM-DD'),
                [TAB_TRANSFER_FILTER_KEY.TO_DATE]: toDate && moment(toDate).format('YYYY-MM-DD')

            })
        },
        handleOpenConfirmDialog: props => (status) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: status})})
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
        },
        handleSubmitOrderReturnDialog: props => () => {
            const {dispatch, filter, location: {pathname}, params} = props
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
            return dispatch(stockReceiveItemReturnAction(id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockReceiveListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно принять'}))
                })
        },
        handleSubmitTransferAcceptDialog: props => () => {
            const {dispatch, filter, location: {pathname, query}, params} = props
            const id = _.toInteger(_.get(params, 'stockTransferId'))
            const stockId = Number(_.get(query, TYPE))
            return dispatch(stockTransferItemAcceptAction(id, stockId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockTransferListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно принять'}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: '',
                        arrMessage: error
                    }))
                })
        },
        handleSubmitReceiveConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname, query}, params} = props
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
            const status = _.get(query, STOCK_CONFIRM_DIALOG_OPEN)

            return dispatch(stockReceiveItemConfirmAction(id, status))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockReceiveListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно принять'}))
                })
        },
        handleSubmitReceiveDeliveryConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, params} = props
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
            return dispatch(stockReceiveDeliveryConfirmAction(id, 'accept'))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockReceiveListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно принять'}))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STOCK_TRANSFER_LIST_URL,
                query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})
            })
        },
        handleOpenDetail: props => (id, type) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STOCK_TRANSFER_ITEM_PATH, id), query: filter.getParams({[TYPE]: type})})
        }
    })
)

const StockTransferList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        location,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        detailLoading,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'stockTransferId'))
    const detailType = _.get(location, ['query', TYPE])
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const stock = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.TYPE))
    const fromDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.TO_DATE)
    const acceptanceFromDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.ACCEPTANCE_FROM_DATE)
    const acceptanceToDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.ACCEPTANCE_TO_DATE)
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const transferData = {
        handleOpenDetail: props.handleOpenDetail,
        data: _.get(list, 'results'),
        listLoading
    }
    const orderData = {
        data: printList,
        printLoading
    }

    const confirmDialog = {
        openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSubmitTransferAcceptDialog: props.handleSubmitTransferAcceptDialog,
        handleSubmitReceiveConfirmDialog: props.handleSubmitReceiveConfirmDialog,
        handleSubmitOrderReturnDialog: props.handleSubmitOrderReturnDialog,
        handleSubmitReceiveDeliveryConfirmDialog: props.handleSubmitReceiveDeliveryConfirmDialog
    }

    const filterDialog = {
        initialValues: {
            type: {
                value: type
            },
            date: {
                fromDate: fromDate && moment(fromDate),
                toDate: toDate && moment(toDate)
            },
            acceptanceDate: {
                fromDate: acceptanceFromDate && moment(acceptanceFromDate),
                toDate: acceptanceToDate && moment(acceptanceToDate)
            },
            stock: {
                value: stock
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitTabReceiveFilterDialog: props.handleSubmitTabReceiveFilterDialog
    }

    const printDialog = {
        openPrint,
        handleOpenPrintDialog: props.handleOpenPrintDialog,
        handleClosePrintDialog: props.handleClosePrintDialog
    }

    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading
    }

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={orderData}/>
    }
    document.getElementById('wrapper').style.height = '100%'

    return (
        <Layout {...layout}>
            <TabTransfer
                filter={filter}
                listData={transferData}
                detailData={detailData}
                handleCloseDetail={handleCloseDetail}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                printDialog={printDialog}/>
        </Layout>
    )
})

export default StockTransferList