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
import TabReceive from '../../components/StockReceive/StockTabReceive'
import {OrderPrint} from '../../components/Order'
import {
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    HISTORY_FILTER_KEY,
    STOCK_RETURN_DIALOG_OPEN,
    STOCK_SUPPLY_DIALOG_OPEN,
    SROCK_POPVER_DIALOG_OPEN,
    STOCK_CONFIRM_DIALOG_OPEN,
    STOCK_RECEIVE_CREATE_DIALOG_OPEN,
    STOCK_RECEIVE_UPDATE_DIALOG_OPEN,
    TAB,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveItemFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction,
    historyOrderItemFetchAction,
    stockReceiveItemReturnAction,
    stockReceiveDeliveryConfirmAction,
    stockTransferItemAcceptAction,
    stockTransferListFetchAction,
    stockReceiveCreateAction,
    stockReceiveUpdateAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction,
    orderReturnListAction
} from '../../actions/order'
import {returnItemFetchAction} from '../../actions/return'
import {supplyItemFetchAction} from '../../actions/supply'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'

const TYPE = 'openType'
const POP_TYPE = 'popType'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const stockReceiveType = _.get(props, ['location', 'query', 'openType'])
        const stockOrgType = _.get(props, ['location', 'query', 'openPopoverDialog'])
        const detail = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'data'])
            : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'data'])
                : (stockReceiveType === 'stock_transfer' || stockOrgType) ? _.get(state, ['stockReceive', 'stockTransfer', 'data'])
                    : (stockReceiveType === 'delivery_return') ? _.get(state, ['stockReceive', 'transferItem', 'data'])
                        : _.get(state, ['order', 'returnList', 'data'])

        const detailProducts = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'loading'])
            : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
                : (stockReceiveType === 'stock_transfer') ? _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
                    : (stockReceiveType === 'delivery_return') ? _.get(state, ['stockReceive', 'transferItem', 'loading'])
                        : _.get(state, ['order', 'returnList', 'loading'])

        const list = _.get(state, ['stockReceive', 'list', 'data'])
        const transferList = _.get(state, ['stockReceive', 'list', 'data'])
        const transferListLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const transferDetail = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const tabTransferFilterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const stockTransferDialogData = _.get(state, ['stockReceive', 'stockTransfer', 'data'])
        const stockTransferDialogDataLoading = _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
        const stockDeliveryReturnDialogData = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const stockDeliveryReturnDialogDataLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const createLoading = _.get(state, ['stockReceive', 'create', 'loading'])
        const createForm = _.get(state, ['form', 'StockReceiveCreateForm'])
        const isDefect = _.get(state, ['form', 'StockReceiveCreateForm', 'values', 'isDefect'])

        return {
            list,
            transferList,
            transferListLoading,
            transferDetail,
            detail,
            detailProducts,
            detailLoading,
            filter,
            printList,
            printLoading,
            historyFilterForm,
            tabTransferFilterForm,
            stockTransferDialogData,
            stockTransferDialogDataLoading,
            stockDeliveryReturnDialogData,
            stockDeliveryReturnDialogDataLoading,
            createLoading,
            createForm,
            isDefect
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        const history = true
        dispatch(stockReceiveListFetchAction(filter, history))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockReceiveId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockReceiveId']))
        return prevId !== nextId
    }, ({dispatch, params, location}) => {
        const stockReceiveType = _.get(location, ['query', 'openType'])
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        if (stockReceiveType === 'supply') {
            dispatch(stockReceiveItemFetchAction(stockReceiveId))
        } else if (stockReceiveType === 'transfer') {
            dispatch(stockReceiveOrderItemFetchAction(stockReceiveId))
        } else if (stockReceiveType === 'order_return') {
            dispatch(orderReturnListAction(stockReceiveId))
        } else if (stockReceiveType === 'delivery_return') {
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
        const popoverDialog = _.get(location, ['query', SROCK_POPVER_DIALOG_OPEN])
        const dialog = _.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN])
        const returnDialog = _.get(location, ['query', STOCK_RETURN_DIALOG_OPEN])
        const stockDialog = _.get(location, ['query', STOCK_SUPPLY_DIALOG_OPEN])
        if (dialog !== 'false' && dialog && !popoverDialog) {
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
        const open = _.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN])
        const popoverType = (_.get(location, ['query', POP_TYPE]))
        if (dialog !== 'false' && dialog) {
            if (popoverType === 'transfer') {
                dispatch(stockReceiveOrderItemFetchAction(dialog))
            } else if (popoverType === 'stock_transfer' || open) {
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

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STOCK_RECEIVE_LIST_URL,
                query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})
            })
        },
        handleOpenDetail: props => (id, type, typeOrg) => {
            const {filter, location: {pathname}} = props
            if (typeOrg === 'transfer') {
                hashHistory.push({
                    pathname,
                    query: filter.getParams({
                        [TYPE]: type,
                        [STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: id,
                        [SROCK_POPVER_DIALOG_OPEN]: id
                    })
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.STOCK_RECEIVE_ITEM_PATH, id),
                    query: filter.getParams({
                        [TYPE]: type,
                        [STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false,
                        [SROCK_POPVER_DIALOG_OPEN]: false
                    })
                })
            }
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
        handleOpenHistoryDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: id})})
        },

        handleCloseHistoryDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})})
        },

        handleOpenPopoverDialog: props => (id, type) => {
            const {location: {pathname}, filter, setType} = props
            hashHistory.push({pathname, query: filter.getParams({[SROCK_POPVER_DIALOG_OPEN]: id, [POP_TYPE]: type})})
            setType(type)
        },

        handleClosePopoverDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SROCK_POPVER_DIALOG_OPEN]: false, [POP_TYPE]: null})})
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
        }
    })
)

const StockReceiveHistoryList = enhance((props) => {
    const {
        transferList,
        transferListLoading,
        transferDetail,
        location,
        detail,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        stockTransferDialogData,
        stockTransferDialogDataLoading,
        stockDeliveryReturnDialogData,
        stockDeliveryReturnDialogDataLoading,
        createLoading,
        isDefect,
        detailProducts,
        detailLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const openHistoryInfoDialog = _.toNumber(_.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]))
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_UPDATE_DIALOG_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_CREATE_DIALOG_OPEN]))
    const brand = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.BRAND))
    const stock = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TYPE))
    const productType = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT_TYPE))
    const product = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT))
    const fromDate = filter.getParam(HISTORY_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(HISTORY_FILTER_KEY.TO_DATE)
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const popoverDialogOpen = _.toNumber(_.get(location, ['query', SROCK_POPVER_DIALOG_OPEN]))
    const popoverType = _.get(location, ['query', 'popType'])
    const historyDialog = {
        openHistoryInfoDialog,
        handleOpenHistoryDialog: props.handleOpenHistoryDialog,
        handleCloseHistoryDialog: props.handleCloseHistoryDialog
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

    const popoverDialog = {
        type: popoverType,
        data: popoverType === 'stock_transfer' || popoverType === 'transfer' || openHistoryInfoDialog ? stockTransferDialogData
            : (popoverType === 'delivery_return' ? stockDeliveryReturnDialogData : null),
        loading: popoverType === 'stock_transfer' || popoverType === 'transfer' || openHistoryInfoDialog ? stockTransferDialogDataLoading
            : (popoverType === 'delivery_return' ? stockDeliveryReturnDialogDataLoading : null),
        open: popoverDialogOpen,
        handleOpenDialog: props.handleOpenPopoverDialog,
        onClose: props.handleClosePopoverDialog
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

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={orderData}/>
    }
    document.getElementById('wrapper').style.height = '100%'

    return (
        <Layout {...layout}>
            <TabReceive
                updateDialog={updateDialog}
                filter={filter}
                listData={transferData}
                filterDialog={filterDialog}
                detailData={transferDetail}
                handleCloseDetail={handleCloseDetail}
                printDialog={printDialog}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                handleCloseHistoryDialog={historyDialog.handleCloseHistoryDialog}
                popoverDialog={popoverDialog}
                history={true}/>
        </Layout>
    )
})

export default StockReceiveHistoryList
