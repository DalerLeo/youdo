import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import sprintf from 'sprintf'
import moment from 'moment'
import * as ROUTER from '../../constants/routes'
import * as API from '../../constants/api'
import Layout from '../../components/Layout'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import TabTransfer from '../../components/StockReceive/StockTabTransfer'
import {OrderPrint} from '../../components/Order'
import RoutePrint from '../../components/StockReceive/RoutePrint'
import TabTransferDeliveryPrint from '../../components/StockReceive/TabTransferDeliveryPrint'
import getDocuments from '../../helpers/getDocument'
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
    stockTransferDeliveryItemFetchAction,
    stockTransferDeliveryTransferAction,
    routePintFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import t from '../../helpers/translate'

const TOGGLE = 'toggle'
const TYPE = 'openType'
const KEY = 'key'
const ZERO = 0
const ONE = 1
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
        const routePrintList = _.get(state, ['stockReceive', 'routePrint', 'data'])
        const routePrintLoading = _.get(state, ['stockReceive', 'routePrint', 'loading'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const filterForm = _.get(state, ['form', 'TabTransferFilterForm'])
        const transferForm = _.get(state, ['form', 'StockOrderTransferForm'])
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
            transferForm,
            toggle,
            beginDate,
            endDate,
            routePrintList,
            routePrintLoading
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
    }, ({dispatch, toggle, beginDate, endDate, location: {query}}) => {
        const ids = _.get(query, 'ids')
        const dateRange = {
            fromDate: beginDate,
            toDate: endDate
        }
        if (toggle === 'delivery') {
            dispatch(stockTransferDeliveryListFetchAction(dateRange, ids))
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
    }, ({dispatch, beginDate, endDate, toggle, params, location}) => {
        const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
        const stockId = _.get(location, ['query', TYPE])
        const ids = _.get(location, ['query', 'ids'])
        const dateRange = {
            fromDate: beginDate,
            toDate: endDate
        }
        if (toggle === 'delivery') {
            if (_.isNumber(detailId)) {
                dispatch(stockTransferDeliveryItemFetchAction(dateRange, detailId, stockId, ids))
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

    withState('openConfirmTransfer', 'setOpenConfirmTransfer', false),
    withState('openPrint', 'setOpenPrint', false),
    withState('openPrintRoute', 'setOpenPrintRoute', false),
    withState('openDeliveryPrint', 'setOpenDeliveryPrint', false),

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
        handleOpenPrintRouteDialog: props => (ids) => {
            const {setOpenPrintRoute, dispatch} = props
            setOpenPrintRoute(true)
            dispatch(routePintFetchAction(ids))
                .then(() => {
                    window.print()
                })
        },

        handleClosePrintRouteDialog: props => () => {
            const {setOpenPrintRoute} = props
            setOpenPrintRoute(false)
        },

        handleOpenDeliveryPrintDialog: props => () => {
            const {setOpenDeliveryPrint, dispatch, beginDate, endDate, params, location} = props
            const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
            const stockId = _.get(location, ['query', TYPE])
            const dateRange = {
                fromDate: beginDate,
                toDate: endDate
            }
            setOpenDeliveryPrint(true)
            dispatch(stockTransferDeliveryItemFetchAction(dateRange, detailId, stockId))
                .then(() => {
                    window.print()
                })
        },

        handleCloseDeliveryPrintDialog: props => () => {
            const {setOpenDeliveryPrint} = props
            setOpenDeliveryPrint(false)
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
            const stock = _.get(filterForm, ['values', 'stock']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [TAB_TRANSFER_FILTER_OPEN]: false,
                [TAB_TRANSFER_FILTER_KEY.STOCK]: joinArray(stock),
                [TAB_TRANSFER_FILTER_KEY.TYPE]: type,
                [TAB_TRANSFER_FILTER_KEY.FROM_DATE]: fromDate && moment(fromDate).format('YYYY-MM-DD'),
                [TAB_TRANSFER_FILTER_KEY.TO_DATE]: toDate && moment(toDate).format('YYYY-MM-DD')

            })
        },
        handleOpenDeliveryConfirmDialog: props => () => {
            const {setOpenConfirmTransfer} = props
            setOpenConfirmTransfer(true)
        },

        handleCloseDeliveryConfirmDialog: props => () => {
            const {setOpenConfirmTransfer} = props
            setOpenConfirmTransfer(false)
        },

        handleSubmitDeliveryConfirmDialog: props => () => {
            const {setOpenConfirmTransfer, dispatch, deliveryDetail, location, beginDate, endDate} = props
            const stockId = _.get(location, ['query', TYPE])
            const ids = _.get(location, ['query', 'ids'])
            const dateRange = {
                'beginDate': beginDate,
                'endDate': endDate
            }
            return dispatch(stockTransferDeliveryTransferAction(deliveryDetail, stockId, dateRange, ids))
                .then(() => {
                    dispatch(stockTransferDeliveryListFetchAction(dateRange))
                    setOpenConfirmTransfer(false)
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: true})})
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
                    return dispatch(openSnackbarAction({message: t('Успешно принято')}))
                })
        },
        handleSubmitTransferAcceptDialog: props => () => {
            const {dispatch, filter, location: {pathname, query}, params, transferForm} = props
            const id = _.toInteger(_.get(params, 'stockTransferId'))
            const stockId = Number(_.get(query, TYPE))
            const deliveryMan = _.get(transferForm, ['values', 'deliveryMan', 'value'])
            return dispatch(stockTransferItemAcceptAction(id, stockId, deliveryMan))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockTransferListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно принято')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
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
                    return dispatch(openSnackbarAction({message: t('Успешно принять')}))
                })
        },
        handleSubmitReceiveDeliveryConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, params} = props
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
            return dispatch(stockReceiveDeliveryConfirmAction(id, 'accept'))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockReceiveListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно принять')}))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STOCK_TRANSFER_LIST_URL,
                query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false, [KEY]: false})
            })
        },
        handleOpenDetail: props => (id, type, key) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STOCK_TRANSFER_ITEM_PATH, id), query: filter.getParams({[TYPE]: type, [KEY]: key})})
        },

        handleChooseToggle: props => (type) => {
            hashHistory.push({pathname: ROUTER.STOCK_TRANSFER_LIST_URL, query: {[TOGGLE]: type}})
        },
        handleGetRelease: props => () => {
            const {beginDate, endDate, params, location} = props
            const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
            const stockId = _.get(location, ['query', TYPE])
            const ids = _.get(location, ['query', 'ids'])

            const paramsRelease = {
                'begin_date': beginDate,
                'end_date': endDate,
                'delivery_man': detailId > ZERO ? detailId : null,
                'stock': stockId,
                ids
            }
            getDocuments(API.STOCK_TRANSFER_RELEASE, paramsRelease)
        },
        handleGetRoute: props => () => {
            const {beginDate, endDate, params, location} = props
            const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
            const stockId = _.get(location, ['query', TYPE])
            const ids = _.get(location, ['query', 'ids'])
            const paramsRoute = {
                'begin_date': beginDate,
                'end_date': endDate,
                'delivery_man': detailId > ZERO ? detailId : null,
                'stock': stockId,
                ids
            }
            getDocuments(API.STOCK_TRANSFER_ROUTE, paramsRoute)
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
        openPrintRoute,
        routePrintList,
        routePrintLoading,
        openConfirmTransfer,
        openDeliveryPrint,
        printList,
        printLoading,
        toggle,
        params,
        beginDate,
        endDate
    } = props

    const detailId = _.get(params, 'stockTransferId') ? _.toInteger(_.get(params, 'stockTransferId')) : false
    const detailType = _.get(location, ['query', TYPE])
    const openConfirmDialog = _.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN])
    const openFilterDialog = toBoolean(_.get(location, ['query', TAB_TRANSFER_FILTER_OPEN]))
    const key = _.get(location, ['query', KEY])
    const stock = (filter.getParam(TAB_TRANSFER_FILTER_KEY.STOCK))
    const type = (filter.getParam(TAB_TRANSFER_FILTER_KEY.TYPE))
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
        key: key,
        id: detailId,
        data: deliveryDetail,
        stock: _.toNumber(detailType),
        deliveryDetailLoading,
        handleOpenDeliveryPrintDialog: props.handleOpenDeliveryPrintDialog,
        handleCloseDeliveryPrintDialog: props.handleCloseDeliveryPrintDialog
    }

    const orderData = {
        data: printList,
        printLoading
    }
    const routePrintData = {
        data: routePrintList,
        listPrintLoading: routePrintLoading
    }

    const confirmDialog = {
        openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSubmitTransferAcceptDialog: props.handleSubmitTransferAcceptDialog
    }

    const confirmTransfer = {
        openConfirmTransfer,
        handleOpenDeliveryConfirmDialog: props.handleOpenDeliveryConfirmDialog,
        handleCloseDeliveryConfirmDialog: props.handleCloseDeliveryConfirmDialog,
        handleSubmitDeliveryConfirmDialog: props.handleSubmitDeliveryConfirmDialog
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
            stock: stock && splitToArray(stock)
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
    const printRouteDialog = {
        openPrintRoute,
        handleOpenPrintRouteDialog: props.handleOpenPrintRouteDialog,
        handleClosePrintRouteDialog: props.handleClosePrintRouteDialog
    }
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading,
        currentDetail
    }
    const currentDeliverer = _.find(_.get(deliveryData, 'data'), (item) => {
        return _.toInteger(_.get(item, ['user', 'id'])) === _.get(deliveryDetailsData, 'id') &&
            _.toInteger(_.get(item, ['stock', 'id'])) === _.get(deliveryDetailsData, 'stock')
    })
    const deliveryManName = _.get(deliveryDetail, 'deliveryMan')
        ? _.get(deliveryDetail, ['deliveryMan', 'firstName']) + ' ' + _.get(deliveryDetail, ['deliveryMan', 'secondName'])
        : t('Доставщик не определен')

    const orders = _.join(_.get(deliveryDetailsData, ['data', 'orders']), ', ')

    if (openPrintRoute) {
        document.getElementById('wrapper').style.height = 'auto'
        return (
            <RoutePrint
                printRouteDialog={printRouteDialog}
                listPrintData={routePrintData}
                deliveryManName={deliveryManName}
                currentDeliverer={currentDeliverer}
                beginDate={beginDate}
                endDate={endDate}
            />)
    }
    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return (
            <OrderPrint
                printDialog={printDialog}
                listPrintData={orderData}/>)
    } else if (openDeliveryPrint) {
        document.getElementById('wrapper').style.height = 'auto'
        return (
            <TabTransferDeliveryPrint
                printDialog={printDialog}
                deliveryDetailsData={deliveryDetailsData}
                currentDeliverer={currentDeliverer}
                orders={orders}
                orderNo={_.findLastIndex(_.get(deliveryDetailsData, ['data', 'orders'])) + ONE}
                dataRange={_.get(filterDialog.initialValues, 'dateRange')}/>

        )
    }
    document.getElementById('wrapper').style.height = '100%'
    const getRelease = {
        handleGetRelease: props.handleGetRelease
    }
    const getRoute = {
        handleGetRoute: props.handleGetRoute
    }
    const initialValues = {
        deliveryMan: {
            value: _.get(detailData, ['data', 'deliveryMan', 'id'])
        }
    }
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
                getRelease={getRelease}
                getRoute={getRoute}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                printDialog={printDialog}
                printRouteDialog={printRouteDialog}
                confirmTransfer={confirmTransfer}
                initialValues={initialValues}
                currentDeliverer={currentDeliverer}/>
        </Layout>
    )
})

export default StockTransferList
