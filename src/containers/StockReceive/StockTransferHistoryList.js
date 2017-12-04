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
    TAB_TRANSFER_FILTER_OPEN,
    STOCK_REPEAL_DIALOG_OPEN,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction,
    stockTransferHistoryRepealAction
} from '../../actions/stockReceive'
import {orderListPintFetchAction} from '../../actions/order'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'

const STOCK_ID = 'stockId'
const TYPE = 'currentType'
const ZERO = 0
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
        const tabTransferFilterForm = _.get(state, ['form', 'TabTransferFilterForm'])
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
            tabTransferFilterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openTransferFilter: null,
            stockId: null,
            currentType: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(stockTransferListFetchAction(filter, true))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'stockTransferHistoryId'])
        const nextId = _.get(nextProps, ['params', 'stockTransferHistoryId'])
        return prevId !== nextId && nextId
    }, ({dispatch, params, location}) => {
        const stockTransferHistoryId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
        const type = _.get(location, ['query', 'currentType'])
        if (type === 'transfer' && stockTransferHistoryId > ZERO) {
            dispatch(stockReceiveOrderItemFetchAction(stockTransferHistoryId))
        } else if (stockTransferHistoryId > ZERO) {
            dispatch(stockTransferItemFetchAction(stockTransferHistoryId))
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
            hashHistory.push({pathname, query: filter.getParams({[TAB_TRANSFER_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TAB_TRANSFER_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitTabReceiveFilterDialog: props => () => {
            const {filter, tabTransferFilterForm} = props
            const stock = _.get(tabTransferFilterForm, ['values', 'stock', 'value']) || null
            const type = _.get(tabTransferFilterForm, ['values', 'type', 'value']) || null
            const acceptedBy = _.get(tabTransferFilterForm, ['values', 'acceptedBy', 'value']) || null
            const fromDate = _.get(tabTransferFilterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(tabTransferFilterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [TAB_TRANSFER_FILTER_OPEN]: false,
                [TAB_TRANSFER_FILTER_KEY.STOCK]: _.join(stock, '-'),
                [TAB_TRANSFER_FILTER_KEY.TYPE]: type,
                [TAB_TRANSFER_FILTER_KEY.ACCEPTED_BY]: _.join(acceptedBy, '-'),
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
        handleOpenDetail: props => (id, stockId, typeOrg) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STOCK_TRANSFER_HISTORY_ITEM_PATH, id),
                query: filter.getParams({[STOCK_ID]: stockId, [TYPE]: typeOrg})
            })
        },
        handleOpenRepealDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_DIALOG_OPEN]: id})})
        },

        handleCloseRepealDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_DIALOG_OPEN]: false})})
        },
        handleSubmitRepealDialog: props => () => {
            const {location: {pathname}, location, filter, params, dispatch} = props
            const orderId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
            const stockId = _.toInteger(_.get(location, ['query', 'stockId']))
            dispatch(stockTransferHistoryRepealAction(orderId, stockId))
                .then(() => {
                    hashHistory.push({pathname: ROUTER.STOCK_TRANSFER_HISTORY_LIST_URL, query: filter.getParams({[STOCK_REPEAL_DIALOG_OPEN]: false})})
                    dispatch(stockTransferListFetchAction(filter, true))
                    return dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
            hashHistory.push({pathname, query: filter.getParams({[STOCK_REPEAL_DIALOG_OPEN]: false})})
        }
    })
)

const StockTransferHistoryList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        location,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        params
    } = props

    const openRepealDialog = _.toInteger(_.get(location, ['query', STOCK_REPEAL_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
    const transferType = _.get(location, ['query', 'currentType'])
    const stockId = _.get(location, ['query', STOCK_ID])
    const openFilterDialog = toBoolean(_.get(location, ['query', TAB_TRANSFER_FILTER_OPEN]))
    const stock = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.TYPE))
    const acceptedBy = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.ACCEPTED_BY))
    const fromDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TAB_TRANSFER_FILTER_KEY.TO_DATE)
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
    const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(detailId)})
    const detailData = {
        stockId: stockId,
        id: detailId,
        data: detail,
        detailLoading,
        type: transferType,
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
            stock: stock && _.map(_.split(stock, '-'), (item) => {
                return _.toNumber(item)
            }),
            acceptedBy: acceptedBy && _.map(_.split(acceptedBy, '-'), (item) => {
                return _.toNumber(item)
            })
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
            <TabTransferHistory
                filter={filter}
                listData={listData}
                filterDialog={filterDialog}
                detailData={detailData}
                handleCloseDetail={handleCloseDetail}
                printDialog={printDialog}
                transferType={transferType}
                repealDialog={repealDialog}/>
        </Layout>
    )
})

export default StockTransferHistoryList
