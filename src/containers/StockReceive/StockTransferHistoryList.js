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
import TabTransferHistory from '../../components/StockReceive/StockTabTransferHistory'
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
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction,
    stockTransferOrderItemFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction,
    orderReturnListAction
} from '../../actions/order'
import {returnItemFetchAction} from '../../actions/return'
import {supplyItemFetchAction} from '../../actions/supply'

const TYPE = 'openType'
const POP_TYPE = 'popType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockTransfer', 'list', 'data'])
        const listLoading = _.get(state, ['stockTransfer', 'list', 'loading'])
        const transferDetail = _.get(state, ['stockTransfer', 'item', 'data'])
        const transferDetailLoading = _.get(state, ['stockTransfer', 'item', 'loading'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const tabTransferFilterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const stockTransferDialogData = _.get(state, ['stockReceive', 'stockTransfer', 'data'])
        const stockTransferDialogDataLoading = _.get(state, ['stockReceive', 'stockTransfer', 'loading'])
        const stockDeliveryReturnDialogData = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const stockDeliveryReturnDialogDataLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])

        return {
            list,
            listLoading,
            transferDetail,
            transferDetailLoading,
            filter,
            printList,
            printLoading,
            historyFilterForm,
            tabTransferFilterForm,
            stockTransferDialogData,
            stockTransferDialogDataLoading,
            stockDeliveryReturnDialogData,
            stockDeliveryReturnDialogDataLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(stockTransferListFetchAction(filter, true))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockTransferHistoryId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockTransferHistoryId']))
        return prevId !== nextId
    }, ({dispatch, params, location}) => {
        const stockTransferHistoryId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
        const type = _.get(location, ['query', 'openType'])
        if (type === 'transfer') {
            dispatch(stockTransferOrderItemFetchAction(stockTransferHistoryId))
        } else {
            dispatch(stockTransferItemFetchAction(stockTransferHistoryId))
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
                pathname: ROUTER.STOCK_TRANSFER_HISTORY_LIST_URL,
                query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})
            })
        },
        handleOpenDetail: props => (id, type, typeOrg) => {
            const {filter} = props
            if (typeOrg === 'transfer') {
                hashHistory.push({
                    pathname: sprintf(ROUTER.STOCK_TRANSFER_HISTORY_ITEM_PATH, id),
                    query: filter.getParams({
                        [TYPE]: type,
                        [SROCK_POPVER_DIALOG_OPEN]: id
                    })
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.STOCK_TRANSFER_HISTORY_ITEM_PATH, id),
                    query: filter.getParams({
                        [TYPE]: type,
                        [SROCK_POPVER_DIALOG_OPEN]: false
                    })
                })
            }
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
        }
    })
)

const StockTransferHistoryList = enhance((props) => {
    const {
        list,
        listLoading,
        transferDetail,
        transferDetailLoading,
        location,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        stockTransferDialogData,
        stockTransferDialogDataLoading,
        stockDeliveryReturnDialogData,
        stockDeliveryReturnDialogDataLoading,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
    const openHistoryInfoDialog = _.toNumber(_.get(location, ['query', STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const detailType = _.get(location, ['query', TYPE])
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
        data: _.get(list, 'results'),
        listLoading
    }
    const orderData = {
        data: printList,
        printLoading
    }
    const detailData = {
        type: detailType,
        id: detailId,
        data: transferDetail,
        detailLoading: transferDetailLoading
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

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={orderData}/>
    }
    document.getElementById('wrapper').style.height = '100%'

    return (
        <Layout {...layout}>
            <TabTransferHistory
                filter={filter}
                listData={transferData}
                filterDialog={filterDialog}
                detailData={detailData}
                handleCloseDetail={handleCloseDetail}
                printDialog={printDialog}
                handleCloseHistoryDialog={historyDialog.handleCloseHistoryDialog}
                popoverDialog={popoverDialog}/>
        </Layout>
    )
})

export default StockTransferHistoryList
