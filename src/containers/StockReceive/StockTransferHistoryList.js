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
    TAB,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveOrderItemFetchAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'

const TYPE = 'openType'
const TRANSFER_TYPE = 'transferType'
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
        const type = _.get(location, ['query', 'transferType'])
        if (type === 'transfer') {
            dispatch(stockReceiveOrderItemFetchAction(stockTransferHistoryId))
        } else {
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
            hashHistory.push({
                pathname: sprintf(ROUTER.STOCK_TRANSFER_HISTORY_ITEM_PATH, id),
                query: filter.getParams({[TYPE]: type, [TRANSFER_TYPE]: typeOrg})
            })
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

    const detailId = _.toInteger(_.get(params, 'stockTransferHistoryId'))
    const transferType = _.get(location, ['query', 'transferType'])
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const detailType = _.get(location, ['query', TYPE])
    const stock = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(TAB_TRANSFER_FILTER_KEY.TYPE))
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
    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading
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
                transferType={transferType}/>
        </Layout>
    )
})

export default StockTransferHistoryList
