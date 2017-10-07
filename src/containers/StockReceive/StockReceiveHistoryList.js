import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import moment from 'moment'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import TabReceive from '../../components/StockReceive/StockTabReceive'
import {OrderPrint} from '../../components/Order'
import {
    TAB_RECEIVE_HISTORY_FILTER_OPEN,
    STOCK_CONFIRM_DIALOG_OPEN,
    STOCK_REPEAL_HISTORY_DIALOG_OPEN,
    TAB,
    TAB_RECEIVE_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveHistoryItemFetchAction,
    stockTransferItemFetchAction,
    stockReceiveHistoryOrderItemFetchAction,
    stockReceiveHistoryReturnItemFetchAction,
    stockReceiveItemReturnAction,
    stockReceiveDeliveryConfirmAction,
    stockTransferItemAcceptAction,
    stockTransferListFetchAction,
    stockTransferHistoryReturnAction,
    stockReceiveHistorySupplyAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'

const TYPE = 'currentType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const detailProducts = _.get(state, ['stockReceive', 'item', 'data'])
        const list = _.get(state, ['stockReceiveHistory', 'list', 'data'])
        const listLoading = _.get(state, ['stockReceiveHistory', 'list', 'loading'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const filterForm = _.get(state, ['form', 'TabReceiveFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailProducts,
            detailLoading,
            filter,
            printList,
            printLoading,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openReceiveHisFilter: null
        }
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        const history = true
        dispatch(stockReceiveListFetchAction(filter, history))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toNumber(_.get(props, ['params', 'stockReceiveHistoryId']))
        const nextId = _.toNumber(_.get(nextProps, ['params', 'stockReceiveHistoryId']))
        return nextId && prevId !== nextId
    }, ({dispatch, params, location}) => {
        const stockReceiveType = _.get(location, ['query', 'currentType'])
        const stockReceiveHistoryId = _.toInteger(_.get(params, 'stockReceiveHistoryId'))
        if (stockReceiveType === 'supply') {
            dispatch(stockReceiveHistoryItemFetchAction(stockReceiveHistoryId))
        } else if (stockReceiveType === 'transfer') {
            dispatch(stockReceiveHistoryOrderItemFetchAction(stockReceiveHistoryId))
        } else if (stockReceiveType === 'order_return') {
            dispatch(stockReceiveHistoryReturnItemFetchAction(stockReceiveHistoryId))
        } else if (stockReceiveType === 'delivery_return') {
            dispatch(stockTransferItemFetchAction(stockReceiveHistoryId))
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
            hashHistory.push({pathname, query: filter.getParams({[TAB_RECEIVE_HISTORY_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TAB_RECEIVE_HISTORY_FILTER_OPEN]: false})})
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
            filter.filterBy({
                [TAB_RECEIVE_HISTORY_FILTER_OPEN]: false,
                [TAB_RECEIVE_FILTER_KEY.STOCK]: stock,
                [TAB_RECEIVE_FILTER_KEY.TYPE]: type,
                [TAB_RECEIVE_FILTER_KEY.FROM_DATE]: fromDate && moment(fromDate).format('YYYY-MM-DD'),
                [TAB_RECEIVE_FILTER_KEY.TO_DATE]: toDate && moment(toDate).format('YYYY-MM-DD')

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
                pathname: ROUTER.STOCK_RECEIVE_HISTORY_LIST_URL,
                query: filter.getParams()
            })
        },
        handleOpenDetail: props => (id, type) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STOCK_RECEIVE_HISTORY_ITEM_PATH, id),
                query: filter.getParams({[TYPE]: type})
            })
        },

        handleOpenRepealDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_HISTORY_DIALOG_OPEN]: true})})
        },

        handleCloseRepealDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_HISTORY_DIALOG_OPEN]: false})})
        },
        handleSubmitRepealDialog: props => () => {
            const {location: {pathname}, filter, params, dispatch} = props
            const orderId = _.toInteger(_.get(params, 'stockReceiveHistoryId'))
            const currentType = _.get(props, ['location', 'query', 'currentType'])
            const history = true
            if (currentType === 'order_return') {
                dispatch(stockTransferHistoryReturnAction(orderId))
                    .then(() => {
                        hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_HISTORY_DIALOG_OPEN]: false})})
                        dispatch(stockReceiveListFetchAction(filter, history))
                        return dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                    })
                    .catch((error) => {
                        const errorWhole = _.map(error, (item, index) => {
                            return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                        })

                        dispatch(openErrorAction({
                            message: <div style={{padding: '0 30px'}}>
                                {errorWhole}
                            </div>
                        }))
                    })
            } else if (currentType === 'supply') {
                dispatch(stockReceiveHistorySupplyAction(orderId))
                    .then(() => {
                        hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_HISTORY_DIALOG_OPEN]: false})})
                        dispatch(stockReceiveListFetchAction(filter, history))
                        return dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                    })
                    .catch((error) => {
                        const errorWhole = _.map(error, (item, index) => {
                            return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                        })

                        dispatch(openErrorAction({
                            message: <div style={{padding: '0 30px'}}>
                                {errorWhole}
                            </div>
                        }))
                    })
            }
        }
    })
)

const StockReceiveHistoryList = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        detail,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        detailLoading,
        params
    } = props

    const currentType = _.get(location, ['query', TYPE])
    const detailId = _.toInteger(_.get(params, 'stockReceiveHistoryId'))
    const openFilterDialog = toBoolean(_.get(location, ['query', TAB_RECEIVE_HISTORY_FILTER_OPEN]))
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openRepealDialog = toBoolean(_.get(location, ['query', STOCK_REPEAL_HISTORY_DIALOG_OPEN]))
    const stock = _.toInteger(filter.getParam(TAB_RECEIVE_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(TAB_RECEIVE_FILTER_KEY.TYPE))
    const fromDate = filter.getParam(TAB_RECEIVE_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TAB_RECEIVE_FILTER_KEY.TO_DATE)
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const listData = {
        handleOpenDetail: props.handleOpenDetail,
        data: _.get(list, 'results'),
        listLoading
    }
    const orderData = {
        data: printList,
        printLoading
    }
    const currentDetail = _.find(_.get(list, 'results'), (obj) => {
        return _.get(obj, 'id') === detailId && _.get(obj, 'type') === currentType
    })
    const detailData = {
        type: currentType,
        id: detailId,
        data: detail,
        detailLoading,
        currentDetail
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
    const confirmDialog = {
        openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSubmitTransferAcceptDialog: props.handleSubmitTransferAcceptDialog,
        handleSubmitReceiveConfirmDialog: props.handleSubmitReceiveConfirmDialog,
        handleSubmitOrderReturnDialog: props.handleSubmitOrderReturnDialog,
        handleSubmitReceiveDeliveryConfirmDialog: props.handleSubmitReceiveDeliveryConfirmDialog
    }
    const repealDialog = {
        openRepealDialog,
        handleOpenRepealDialog: props.handleOpenRepealDialog,
        handleCloseRepealDialog: props.handleCloseRepealDialog,
        handleSubmitRepealDialog: props.handleSubmitRepealDialog
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
                repealDialog={repealDialog}
                filter={filter}
                listData={listData}
                filterDialog={filterDialog}
                detailData={detailData}
                handleCloseDetail={handleCloseDetail}
                printDialog={printDialog}
                confirmDialog={confirmDialog}
                history={true}/>
        </Layout>
    )
})

export default StockReceiveHistoryList
