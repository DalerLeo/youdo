import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import moment from 'moment'
import {OrderPrint} from '../../components/Order'
import {
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    HISTORY_FILTER_KEY,
    STOCK_RETURN_DIALOG_OPEN,
    STOCK_SUPPLY_DIALOG_OPEN,
    SROCK_POPVER_DIALOG_OPEN,
    TAB,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockHistoryListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction,
    historyOrderItemFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction,
    orderReturnListAction
} from '../../actions/order'
import {returnItemFetchAction} from '../../actions/return'
import {supplyItemFetchAction} from '../../actions/supply'
import TabHistory from '../../components/StockReceive/StockTabHistory'

const POP_TYPE = 'popType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockOutHistory', 'list', 'data'])
        const listLoading = _.get(state, ['stockOutHistory', 'list', 'loading'])
        const historyOrderDetail = _.get(state, ['order', 'item', 'data'])
        const historyOrderLoading = _.get(state, ['order', 'item', 'loading'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const returnDialogData = _.get(state, ['return', 'item', 'data'])
        const returnDialogDataLoading = _.get(state, ['return', 'item', 'loading'])
        const supplyDialogData = _.get(state, ['supply', 'item', 'data'])
        const supplyDialogDataLoading = _.get(state, ['supply', 'item', 'loading'])
        const stockTransferDialogData = _.get(state, ['stockReceive', 'item', 'data'])
        const stockTransferDialogDataLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const stockDeliveryReturnDialogData = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const stockDeliveryReturnDialogDataLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const supplyDialogFilter = filterHelper(supplyDialogData, pathname, query, {
            'page': 'dPage',
            'pageSize': 'dPageSize'
        })

        return {
            list,
            listLoading,
            filter,
            printList,
            printLoading,
            historyFilterForm,
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
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(stockHistoryListFetchAction(filter))
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

const StockOutHistoryList = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
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

    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const openHistoryInfoDialog = _.toNumber(_.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]))
    const brand = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.BRAND))
    const stock = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TYPE))
    const productType = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT_TYPE))
    const product = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT))
    const fromDate = filter.getParam(HISTORY_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(HISTORY_FILTER_KEY.TO_DATE)

    const returnDialogDataOpen = _.toNumber(_.get(location, ['query', STOCK_RETURN_DIALOG_OPEN]))
    const supplyDialogOpen = _.toNumber(_.get(location, ['query', STOCK_SUPPLY_DIALOG_OPEN]) || '0')
    const popoverDialogOpen = _.toNumber(_.get(location, ['query', SROCK_POPVER_DIALOG_OPEN]))
    const popoverType = _.get(location, ['query', 'popType'])

    const historyDialog = {
        openHistoryInfoDialog,
        handleOpenHistoryDialog: props.handleOpenHistoryDialog,
        handleCloseHistoryDialog: props.handleCloseHistoryDialog
    }
    const listData = {
        listLoading,
        historyOrderLoading,
        data: _.get(list, 'results'),
        detailData: {
            data: historyOrderDetail || {},
            id: openHistoryInfoDialog
        }
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

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={orderData}/>
    }
    document.getElementById('wrapper').style.height = '100%'

    return (
        <Layout {...layout}>
            <TabHistory
                filter={filter}
                listData={listData}
                filterDialog={filterDialog}
                historyDialog={historyDialog}
                returnDialog={returnDialog}
                supplyDialog={supplyDialog}
                popoverDialog={popoverDialog}/>
        </Layout>
    )
})

export default StockOutHistoryList
