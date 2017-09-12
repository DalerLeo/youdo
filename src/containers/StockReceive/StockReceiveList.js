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
import {change} from 'redux-form'
import * as STOCK_TAB from '../../constants/stockReceiveTab'
import {OrderPrint} from '../../components/Order'
import {
    StockReceiveGridList,
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    STOCK_RECEIVE_CREATE_DIALOG_OPEN,
    STOCK_RECEIVE_UPDATE_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    HISTORY_FILTER_KEY,
    STOCK_RETURN_DIALOG_OPEN,
    STOCK_SUPPLY_DIALOG_OPEN,
    SROCK_POPVER_DIALOG_OPEN,
    TAB,
    STOCK_CONFIRM_DIALOG_OPEN,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveItemFetchAction,
    stockReceiveCreateAction,
    stockHistoryListFetchAction,
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction,
    stockTransferItemAcceptAction,
    stockReceiveItemConfirmAction,
    stockReceiveItemReturnAction,
    stockReceiveDeliveryConfirmAction,
    stockReceiveUpdateAction,
    historyOrderItemFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction,
    orderReturnListAction
} from '../../actions/order'
import {returnItemFetchAction} from '../../actions/return'
import {supplyItemFetchAction} from '../../actions/supply'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const TYPE = 'openType'
const POP_TYPE = 'popType'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const stockReceiveType = _.get(props, ['location', 'query', 'openType'])
        const detail = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'data'])
            : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'data'])
                : (stockReceiveType === 'stock_transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'data'])
                    : (stockReceiveType === 'delivery_return') ? _.get(state, ['stockReceive', 'transferItem', 'data'])
                        : _.get(state, ['order', 'returnList', 'data'])

        const detailProducts = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'loading'])
            : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
                : (stockReceiveType === 'stock_transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
                    : (stockReceiveType === 'delivery_return') ? _.get(state, ['stockReceive', 'transferItem', 'loading'])
                        : _.get(state, ['order', 'returnList', 'loading'])

        const list = _.get(state, ['stockReceive', 'list', 'data'])
        const listLoading = _.get(state, ['stockReceive', 'list', 'loading'])
        const historyList = _.get(state, ['stockReceive', 'history', 'data'])
        const historyOrderDetail = _.get(state, ['order', 'item', 'data'])
        const historyOrderLoading = _.get(state, ['order', 'item', 'loading'])
        const historyListLoading = _.get(state, ['stockReceive', 'history', 'loading'])
        const transferList = _.get(state, ['stockReceive', 'transfer', 'data'])
        const transferListLoading = _.get(state, ['stockReceive', 'transfer', 'loading'])
        const transferDetail = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const transferDetailLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const barcodeList = _.get(state, ['stockReceive', 'barcodeList', 'data'])
        const barcodeListLoading = _.get(state, ['stockReceive', 'barcodeList', 'loading'])
        const createLoading = _.get(state, ['stockReceive', 'create', 'loading'])
        const createForm = _.get(state, ['form', 'StockReceiveCreateForm'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const tabTransferFilterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const isDefect = _.get(state, ['form', 'StockReceiveCreateForm', 'values', 'isDefect'])
        const productId = _.toNumber(_.get(state, ['form', 'StockReceiveCreateForm', 'values', 'product', 'value', 'id']))
        const filter = filterHelper(
            (_.get(query, 'tab') === 'receive' || _.get(query, 'tab') === 'receiveHistory')
                ? list : ((_.get(query, 'tab') === 'transfer' || _.get(query, 'tab') === 'transferHistory')
                ? transferList : ((_.get(query, 'tab') === 'outHistory')
                    ? historyList : list)), pathname, query)
        const returnDialogData = _.get(state, ['return', 'item', 'data'])
        const returnDialogDataLoading = _.get(state, ['return', 'item', 'loading'])
        const supplyDialogData = _.get(state, ['supply', 'item', 'data'])
        const supplyDialogDataLoading = _.get(state, ['supply', 'item', 'loading'])
        const stockTransferDialogData = _.get(state, ['stockReceive', 'stockTransfer', 'data'])
        const stockTransferDialogDataLoading = _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
        const stockDeliveryReturnDialogData = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const stockDeliveryReturnDialogDataLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const supplyDialogFilter = filterHelper(supplyDialogData, pathname, query, {
            'page': 'dPage',
            'pageSize': 'dPageSize'
        })

        return {
            list,
            listLoading,
            historyList,
            historyListLoading,
            transferList,
            transferListLoading,
            transferDetail,
            transferDetailLoading,
            barcodeList,
            barcodeListLoading,
            detail,
            detailProducts,
            detailLoading,
            createLoading,
            filter,
            createForm,
            isDefect,
            productId,
            printList,
            printLoading,
            historyFilterForm,
            tabTransferFilterForm,
            historyOrderLoading,
            historyOrderDetail,
            returnDialogData,
            returnDialogDataLoading,
            supplyDialogData,
            supplyDialogDataLoading,
            supplyDialogFilter,
            stockTransferDialogData,
            stockTransferDialogDataLoading,
            stockDeliveryReturnDialogData,
            stockDeliveryReturnDialogDataLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || (prevTab !== nextTab)
    }, ({dispatch, filter, location}) => {
        const currentTab = _.get(location, ['query', 'tab']) || 'receive'
        if (currentTab === 'receive') {
            dispatch(stockReceiveListFetchAction(filter))
        } else if (currentTab === 'transfer' || currentTab === 'stock_transfer') {
            dispatch(stockTransferListFetchAction(filter))
        } else if (currentTab === 'outHistory') {
            dispatch(stockHistoryListFetchAction(filter))
        } else if (currentTab === 'transferHistory') {
            const history = true
            dispatch(stockTransferListFetchAction(filter, history))
        } else if (currentTab === 'receiveHistory') {
            const history = true
            dispatch(stockReceiveListFetchAction(filter, history))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockReceiveId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockReceiveId']))
        return prevId !== nextId
    }, ({dispatch, params, location}) => {
        const currentTab = _.get(location, ['query', 'tab']) || 'receive'
        const stockReceiveType = _.get(location, ['query', 'openType'])
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        if (stockReceiveId > ZERO && (currentTab === 'receive' || currentTab === 'receiveHistory')) {
            if (stockReceiveType === 'supply') {
                dispatch(stockReceiveItemFetchAction(stockReceiveId))
            } else if (stockReceiveType === 'transfer') {
                dispatch(stockReceiveOrderItemFetchAction(stockReceiveId))
            } else if (stockReceiveType === 'order_return') {
                dispatch(orderReturnListAction(stockReceiveId))
            } else if (stockReceiveType === 'delivery_return') {
                dispatch(stockTransferItemFetchAction(stockReceiveId))
            }
        } else if ((currentTab === 'transfer' || currentTab === 'transferHistory') && stockReceiveId > ZERO) {
            dispatch(stockTransferItemFetchAction(stockReceiveId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const nextDialog = _.get(nextProps, ['location', 'query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN])
        const prevDialog = _.get(props, ['location', 'query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN])
        const nextReturnDialog = _.get(nextProps, ['location', 'query', STOCK_RETURN_DIALOG_OPEN])
        const prevReturnDialog = _.get(props, ['location', 'query', STOCK_RETURN_DIALOG_OPEN])
        const nextSupplyDialog = _.get(nextProps, ['location', 'query', STOCK_SUPPLY_DIALOG_OPEN])
        const prevSupplyDialog = _.get(props, ['location', 'query', STOCK_SUPPLY_DIALOG_OPEN])
        return (prevDialog !== nextDialog && nextDialog !== 'false') ||
                (prevReturnDialog !== nextReturnDialog && nextReturnDialog !== 'false') ||
                 (prevSupplyDialog !== nextSupplyDialog && nextSupplyDialog !== 'false')
    }, ({dispatch, location}) => {
        const dialog = _.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN])
        const returnDialog = _.get(location, ['query', STOCK_RETURN_DIALOG_OPEN])
        const stockDialog = _.get(location, ['query', STOCK_SUPPLY_DIALOG_OPEN])
        if (dialog !== 'false' && dialog) {
            dispatch(historyOrderItemFetchAction(_.toNumber(dialog)))
        } else if (returnDialog !== 'false' && returnDialog) {
            dispatch(returnItemFetchAction(_.toNumber(returnDialog)))
        } else if (stockDialog !== 'false' && stockDialog) {
            dispatch(supplyItemFetchAction(_.toNumber(stockDialog)))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const nextPopoverDialog = _.get(nextProps, ['location', 'query', SROCK_POPVER_DIALOG_OPEN])
        const prevPopoverDialog = _.get(props, ['location', 'query', SROCK_POPVER_DIALOG_OPEN])
        return prevPopoverDialog !== nextPopoverDialog && nextPopoverDialog !== 'false'
    }, ({dispatch, location}) => {
        const dialog = _.toNumber(_.get(location, ['query', SROCK_POPVER_DIALOG_OPEN]))
        const popoverType = (_.get(location, ['query', POP_TYPE]))
        if (dialog !== 'false' && dialog) {
            if (popoverType === 'transfer') {
                dispatch(stockReceiveOrderItemFetchAction(dialog))
            } else if (popoverType === 'stock_transfer') {
                dispatch(stockReceiveOrderItemFetchAction(dialog))
            } else if (popoverType === 'order_return') {
                dispatch(orderReturnListAction(dialog))
            } else if (popoverType === 'delivery_return') {
                dispatch(stockTransferItemFetchAction(dialog))
            }
        }
    }),

    withState('openPrint', 'setOpenPrint', false),
    withState('popoverType', 'setType', ''),

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
        handleTabChange: props => (tab) => {
            hashHistory.push({
                pathname: 'stockReceive',
                query: {[TAB]: tab}
            })
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
        handleSubmitFilterDialog: props => () => {
            const {filter, historyFilterForm} = props
            const stock = _.get(historyFilterForm, ['values', 'stock', 'value']) || null
            const type = _.get(historyFilterForm, ['values', 'type', 'value']) || null
            const status = _.get(historyFilterForm, ['values', 'status', 'value']) || null
            const product = _.get(historyFilterForm, ['values', 'product', 'value']) || null
            const fromDate = _.get(historyFilterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(historyFilterForm, ['values', 'date', 'toDate']) || null
            const typeChild = _.get(historyFilterForm, ['values', 'typeChild', 'value']) || null

            filter.filterBy({
                [HISTORY_FILTER_OPEN]: false,
                [HISTORY_FILTER_KEY.STOCK]: stock,
                [HISTORY_FILTER_KEY.TYPE]: type,
                [HISTORY_FILTER_KEY.STATUS]: status,
                [HISTORY_FILTER_KEY.PRODUCT]: product,
                [HISTORY_FILTER_KEY.TYPE_CHILD]: typeChild,
                [HISTORY_FILTER_KEY.FROM_DATE]: fromDate && moment(fromDate).format('YYYY-MM-DD'),
                [HISTORY_FILTER_KEY.TO_DATE]: toDate && moment(toDate).format('YYYY-MM-DD')

            })
        },

        handleSubmitTabReceiveFilterDialog: props => () => {
            const {filter, tabTransferFilterForm} = props
            const stock = _.get(tabTransferFilterForm, ['values', 'stock', 'value']) || null
            const type = _.get(tabTransferFilterForm, ['values', 'type', 'value']) || null
            const fromDate = _.get(tabTransferFilterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(tabTransferFilterForm, ['values', 'date', 'toDate']) || null
            const acceptanceFromData = _.get(tabTransferFilterForm, ['values', 'acceptanceDate', 'fromDate']) || null
            const acceptanceToDate = _.get(tabTransferFilterForm, ['values', 'acceptanceDate', 'toDate']) || null
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
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
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
        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, params, detail} = props
            const formValues = _.get(createForm, ['values'])
            const supplyId = _.toInteger(_.get(params, 'stockReceiveId'))

            return dispatch(stockReceiveCreateAction(formValues, supplyId, detail))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_CREATE_DIALOG_OPEN]: false})})
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    dispatch(stockReceiveListFetchAction(filter))
                })
                .catch((error) => {
                    const comment = _.map(error, (item, index) => {
                        return (
                            <div key={index}>
                                <p>{_.get(item, 'amount')}</p>
                                {_.get(item, 'amount or defect_amount') ||
                                <p>{_.get(item, 'amount or defect_amount')}</p>}
                            </div>
                        )
                    })
                    return dispatch(openErrorAction({message: comment}))
                })
        },
        handleOpenUpdateDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, params, detail} = props
            const formValues = _.get(createForm, ['values'])
            const supplyId = _.toInteger(_.get(params, 'stockReceiveId'))
            const history = true
            return dispatch(stockReceiveUpdateAction(formValues, supplyId, detail))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_UPDATE_DIALOG_OPEN]: false})})
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    dispatch(stockReceiveListFetchAction(filter, history))
                })
                .catch((error) => {
                    const comment = _.map(error, (item) => {
                        return (<p>{_.get(item, 'amount')}</p>)
                    })
                    return dispatch(openErrorAction({message: comment}))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STOCK_RECEIVE_LIST_URL, query: filter.getParams()})
        },
        handleOpenDetail: props => (id, type) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STOCK_RECEIVE_ITEM_PATH, id),
                query: filter.getParams({[TYPE]: type})
            })
        },
        handleCheckedForm: props => (index, value, selected) => {
            const {dispatch} = props
            const val = !selected ? value : ''
            const form = 'StockReceiveCreateForm'
            dispatch(change(form, 'product[' + index + '][accepted]', val))
        },
        handleCheckedDefect: props => (index, value) => {
            const {dispatch} = props
            const zero = 0
            const val = _.toNumber(value)
            const form = 'StockReceiveCreateForm'
            dispatch(change(form, 'product[' + index + '][accepted]', val))
            dispatch(change(form, 'product[' + index + '][defected]', zero))
        },
        handleOpenHistoryDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: id})})
        },

        handleCloseHistoryDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})})
        },

        handleOpenStockReturnDialog: props => (id) => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RETURN_DIALOG_OPEN]: id})})
            dispatch(returnItemFetchAction(id))
        },

        handleCloseStockReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RETURN_DIALOG_OPEN]: false})})
        },
        handleOpenStockSupplyDialog: props => (id) => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_SUPPLY_DIALOG_OPEN]: id})})
            dispatch(supplyItemFetchAction(id))
        },

        handleCloseStockSupplyDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_SUPPLY_DIALOG_OPEN]: false})})
        },

        handleOpenPopoverDialog: props => (id, type) => {
            const {location: {pathname}, filter, setType} = props
            hashHistory.push({pathname, query: filter.getParams({[SROCK_POPVER_DIALOG_OPEN]: id, [POP_TYPE]: type})})
            setType(type)
        },

        handleClosePopoverDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SROCK_POPVER_DIALOG_OPEN]: false, [POP_TYPE]: null})})
        }
    })
)

const StockReceiveList = enhance((props) => {
    const {
        list,
        listLoading,
        historyList,
        historyListLoading,
        transferList,
        transferListLoading,
        transferDetail,
        transferDetailLoading,
        location,
        detail,
        detailProducts,
        detailLoading,
        createLoading,
        isDefect,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        params,
        historyOrderDetail,
        historyOrderLoading,
        returnDialogData,
        returnDialogDataLoading,
        supplyDialogData,
        supplyDialogDataLoading,
        supplyDialogFilter,
        stockTransferDialogData,
        stockTransferDialogDataLoading,
        stockDeliveryReturnDialogData,
        stockDeliveryReturnDialogDataLoading
    } = props

    const detailType = _.get(location, ['query', TYPE])
    const detailId = _.toInteger(_.get(params, 'stockReceiveId'))
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_CREATE_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_UPDATE_DIALOG_OPEN]))
    const openHistoryInfoDialog = _.toNumber(_.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]))
    const brand = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.BRAND))
    const stock = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TYPE))
    const productType = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT_TYPE))
    const product = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT))
    const fromDate = filter.getParam(HISTORY_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(HISTORY_FILTER_KEY.TO_DATE)
    const tab = _.get(location, ['query', TAB]) || STOCK_TAB.STOCK_RECEIVE_DEFAULT_TAB
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const returnDialogDataOpen = _.toNumber(_.get(location, ['query', STOCK_RETURN_DIALOG_OPEN]))
    const supplyDialogOpen = _.toNumber(_.get(location, ['query', STOCK_SUPPLY_DIALOG_OPEN]) || '0')
    const popoverDialogOpen = _.toNumber(_.get(location, ['query', SROCK_POPVER_DIALOG_OPEN]))
    const popoverType = _.get(location, ['query', 'popType'])

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleOpenDetail: props.handleOpenDetail
    }

    const historyDialog = {
        openHistoryInfoDialog,
        handleOpenHistoryDialog: props.handleOpenHistoryDialog,
        handleCloseHistoryDialog: props.handleCloseHistoryDialog
    }
    const historyData = {
        historyListLoading,
        historyOrderLoading,
        data: _.get(historyList, 'results'),
        detailData: {
            data: historyOrderDetail || {},
            id: openHistoryInfoDialog
        }
    }

    const transferData = {
        handleOpenDetail: props.handleOpenDetail,
        data: _.get(transferList, 'results'),
        transferListLoading
    }
    const orderData = {
        data: printList,
        printLoading
    }
    const currentTransferDetail = _.find(_.get(transferList, 'results'), (obj) => {
        return _.get(obj, 'id') === detailId && Number(_.get(obj, ['stock', 'id'])) === Number(detailType)
    })
    const transferDetailData = {
        type: detailType,
        id: detailId,
        data: transferDetail,
        transferDetailLoading,
        currentTransferDetail
    }
    const currentDetail = _.find(_.get(list, 'results'), (obj) => {
        return _.get(obj, 'id') === detailId && _.get(obj, 'type') === detailType
    })

    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading,
        currentDetail
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
    const createDialog = {
        createLoading,
        openCreateDialog,
        isDefect,
        detailProducts: detailProducts || {},
        detailLoading,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }
    const updateDialog = {
        detailProducts: detailProducts || {},
        updateLoading: detailLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog,
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }
            return {
                product: _.map(_.get(detail, 'products'), (item) => {
                    const MINUS_ONE = -1
                    const posted = _.toNumber(_.get(item, 'postedAmount')) < ZERO ? (_.toNumber(_.get(item, 'postedAmount')) * MINUS_ONE) : _.toNumber(_.get(item, 'postedAmount'))
                    const defected = _.toNumber(_.get(item, 'defectAmount')) < ZERO ? (_.toNumber(_.get(item, 'defectAmount')) * MINUS_ONE) : _.toNumber(_.get(item, 'defectAmount'))
                    return {
                        accepted: posted,
                        defected: defected
                    }
                })
            }
        })()
    }
    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const filterDialog = {
        initialValues: {
            brand: {
                value: brand
            },
            type: {
                value: type
            },
            product: {
                value: product
            },
            date: {
                fromDate: fromDate && moment(fromDate),
                toDate: toDate && moment(toDate)
            },
            productType: {
                value: productType
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
        handleSubmitFilterDialog: props.handleSubmitFilterDialog,
        handleSubmitTabReceiveFilterDialog: props.handleSubmitTabReceiveFilterDialog
    }

    const printDialog = {
        openPrint,
        handleOpenPrintDialog: props.handleOpenPrintDialog,
        handleClosePrintDialog: props.handleClosePrintDialog
    }

    const returnDialog = {
        data: returnDialogData,
        open: returnDialogDataOpen,
        loading: returnDialogDataLoading,
        handleOpenStockReturnDialog: props.handleOpenStockReturnDialog,
        handleCloseStockReturnDialog: props.handleCloseStockReturnDialog
    }
    const supplyDialog = {
        data: supplyDialogData,
        open: supplyDialogOpen,
        loading: supplyDialogDataLoading,
        handleOpenStockSupplyDialog: props.handleOpenStockSupplyDialog,
        handleCloseStockSupplyDialog: props.handleCloseStockSupplyDialog,
        filter: supplyDialogFilter
    }
    const stockTransferDialog = {
        data: stockTransferDialogData,
        open: popoverDialogOpen,
        loading: stockTransferDialogDataLoading,
        handleOpenStockTransferDialog: props.handleOpenStockTransferDialog,
        handleCloseStockTransferDialog: props.handleCloseStockTransferDialog,
        filter: supplyDialogFilter
    }
    const orderReturnDialog = {
        data: stockTransferDialogData,
        open: popoverDialogOpen,
        loading: stockTransferDialogDataLoading,
        handleOpenStockTransferDialog: props.handleOpenStockTransferDialog,
        handleCloseStockTransferDialog: props.handleCloseStockTransferDialog,
        filter: supplyDialogFilter
    }
    const writeOfDialog = {
        data: stockTransferDialogData,
        open: popoverDialogOpen,
        loading: stockTransferDialogDataLoading,
        handleOpenStockTransferDialog: props.handleOpenStockTransferDialog,
        handleCloseStockTransferDialog: props.handleCloseStockTransferDialog,
        filter: supplyDialogFilter
    }
    const deliveryReturnDialog = {
        data: stockTransferDialogData,
        open: popoverDialogOpen,
        loading: stockTransferDialogDataLoading,
        handleOpenStockTransferDialog: props.handleOpenStockTransferDialog,
        handleCloseStockTransferDialog: props.handleCloseStockTransferDialog,
        filter: supplyDialogFilter
    }

    const popoverDialog = {
        type: popoverType,
        data: popoverType === 'stock_transfer' || popoverType === 'transfer' ? stockTransferDialogData
            : (popoverType === 'delivery_return' ? stockDeliveryReturnDialogData : null),
        loading: popoverType === 'stock_transfer' || popoverType === 'transfer' ? stockTransferDialogDataLoading
            : (popoverType === 'delivery_return' ? stockDeliveryReturnDialogDataLoading : null),
        open: popoverDialogOpen,
        handleOpenDialog: props.handleOpenPopoverDialog,
        onClose: props.handleClosePopoverDialog
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
            <StockReceiveGridList
                filter={filter}
                tabData={tabData}
                listData={listData}
                filterDialog={filterDialog}
                historyData={historyData}
                transferData={transferData}
                transferDetail={transferDetailData}
                detailData={detailData}
                createDialog={createDialog}
                handleCloseDetail={handleCloseDetail}
                confirmDialog={confirmDialog}
                printDialog={printDialog}
                updateDialog={updateDialog}
                handleCheckedForm={props.handleCheckedForm}
                historyDialog={historyDialog}
                returnDialog={returnDialog}
                supplyDialog={supplyDialog}
                stockTransferDialog={stockTransferDialog}
                orderReturnDialog={orderReturnDialog}
                writeOfDialog={writeOfDialog}
                deliveryReturnDialog={deliveryReturnDialog}
                popoverDialog={popoverDialog}
                handleCheckedDefect={props.handleCheckedDefect}
            />
        </Layout>
    )
})

export default StockReceiveList
