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
    TAB_TRANSFER_FILTER_OPEN,
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
    stockReceiveDeliveryConfirmAction,
    stockTransferDeliveryListFetchAction,
    stockTransferDeliveryItemFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const TOGGLE = 'toggle'
const TYPE = 'openType'
const ZERO = 0
const defaultDate = moment().format('YYYY-MM-DD')
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockTransfer', 'list', 'data'])
        const listLoading = _.get(state, ['stockTransfer', 'list', 'loading'])
        const deliveryList = _.get(state, ['stockTransfer', 'deliveryList', 'data'])
        const deliveryListLoading = _.get(state, ['stockTransfer', 'deliveryList', 'loading'])
        const deliveryDetail = _.get(state, ['stockTransfer', 'deliveryDetail', 'data'])
        const deliveryDetailLoading = _.get(state, ['stockTransfer', 'deliveryDetail', 'loading'])
        const detail = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const filterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterDelivery = filterHelper(deliveryList, pathname, query)
        const toggle = _.get(query, TOGGLE) || 'order'
        const beginDate = _.get(query, 'beginDate') || defaultDate
        const endDate = _.get(query, 'endDate') || defaultDate

        return {
            list,
            listLoading,
            deliveryList,
            deliveryListLoading,
            deliveryDetail,
            deliveryDetailLoading,
            detail,
            detailLoading,
            filter,
            filterDelivery,
            printList,
            printLoading,
            historyFilterForm,
            filterForm,
            toggle,
            beginDate,
            endDate
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openTransferFilter: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter, toggle}) => {
        if (toggle === 'order') {
            dispatch(stockTransferListFetchAction(filter))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openTransferFilter: null
        }
        const toggle = _.get(props, 'toggle')
        const nextToggle = _.get(nextProps, 'toggle')
        return (toggle !== nextToggle && nextToggle === 'delivery') ||
            (props.filterDelivery.filterRequest(except) !== nextProps.filterDelivery.filterRequest(except) && nextToggle === 'delivery')
    }, ({dispatch, toggle, beginDate, endDate}) => {
        const dateRange = {
            fromDate: beginDate,
            toDate: endDate
        }
        if (toggle === 'delivery') {
            dispatch(stockTransferDeliveryListFetchAction(dateRange))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const beginDate = _.get(props, 'beginDate')
        const endDate = _.get(props, 'endDate')
        const nextBeginDate = _.get(nextProps, 'beginDate')
        const nextEndDate = _.get(nextProps, 'endDate')
        const detailId = _.get(props, ['params', 'stockTransferId']) ? _.toInteger(_.get(props, ['params', 'stockTransferId'])) : false
        const nextDetailId = _.get(nextProps, ['params', 'stockTransferId']) ? _.toInteger(_.get(nextProps, ['params', 'stockTransferId'])) : false
        return (beginDate !== nextBeginDate) ||
            (endDate !== nextEndDate) ||
            (detailId !== nextDetailId)
    }, ({dispatch, beginDate, endDate, toggle, params}) => {
        const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
        const dateRange = {
            fromDate: beginDate,
            toDate: endDate
        }
        if (toggle === 'delivery') {
            if (_.isNumber(detailId)) {
                dispatch(stockTransferDeliveryItemFetchAction(dateRange, detailId))
            }
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'stockTransferId'])
        const nextId = _.get(nextProps, ['params', 'stockTransferId'])
        return nextId && prevId !== nextId
    }, ({dispatch, params, toggle}) => {
        const stockTransferId = _.toInteger(_.get(params, 'stockTransferId'))
        if (stockTransferId > ZERO) {
            if (toggle === 'order') {
                dispatch(stockTransferItemFetchAction(stockTransferId))
            }
        }
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
            hashHistory.push({pathname, query: filter.getParams({[TAB_TRANSFER_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TAB_TRANSFER_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname, query}} = props
            const toggle = _.get(query, 'toggle') || 'order'
            hashHistory.push({pathname, query: {[TOGGLE]: toggle}})
        },

        handleSubmitTabReceiveFilterDialog: props => () => {
            const {filter, filterForm} = props
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [TAB_TRANSFER_FILTER_OPEN]: false,
                [TAB_TRANSFER_FILTER_KEY.STOCK]: stock,
                [TAB_TRANSFER_FILTER_KEY.TYPE]: type,
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
        },

        handleChooseToggle: props => (type) => {
            hashHistory.push({pathname: ROUTER.STOCK_TRANSFER_LIST_URL, query: {[TOGGLE]: type}})
        }
    })
)

const StockTransferList = enhance((props) => {
    const {
        list,
        listLoading,
        deliveryList,
        deliveryListLoading,
        deliveryDetail,
        deliveryDetailLoading,
        detail,
        detailLoading,
        location,
        filter,
        filterDelivery,
        layout,
        openPrint,
        printList,
        printLoading,
        toggle,
        params,
        beginDate,
        endDate
    } = props

    const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
    const detailType = _.get(location, ['query', TYPE])
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', TAB_TRANSFER_FILTER_OPEN]))
    const stock = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.TYPE))
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const toggleData = {
        toggle,
        handleChooseToggle: props.handleChooseToggle
    }

    const listData = {
        handleOpenDetail: props.handleOpenDetail,
        data: _.get(list, 'results'),
        listLoading
    }

    const deliveryData = {
        data: _.get(deliveryList, 'results'),
        deliveryListLoading
    }

    const deliveryDetailsData = {
        id: detailId,
        data: deliveryDetail,
        deliveryDetailLoading
    }

    const orderData = {
        data: printList,
        printLoading
    }

    const confirmDialog = {
        openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSubmitTransferAcceptDialog: props.handleSubmitTransferAcceptDialog
    }

    const filterDialog = {
        initialValues: {
            type: {
                value: type
            },
            dateRange: {
                startDate: moment(beginDate),
                endDate: moment(endDate)
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
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading,
        currentDetail
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
                filterDelivery={filterDelivery}
                deliveryData={deliveryData}
                deliveryDetailsData={deliveryDetailsData}
                listData={listData}
                detailData={detailData}
                toggleData={toggleData}
                handleCloseDetail={handleCloseDetail}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                printDialog={printDialog}/>
        </Layout>
    )
})

export default StockTransferList
