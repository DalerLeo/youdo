import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'
import reset from 'redux-form'
import * as STOCK_TAB from '../../constants/stockReceiveTab'
import {
    StockReceiveGridList,
    STOCK_RECEIVE_CREATE_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    HISTORY_FILTER_KEY,
    TAB,
    STOCK_TRANSFER_ACCEPT_DIALOG_OPEN
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveItemFetchAction,
    stockReceiveCreateAction,
    stockHistoryListFetchAction,
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockTransferItemAcceptAction
} from '../../actions/stockReceive'
import {orderReturnListAction} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'

const TYPE = 'openType'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const stockReceiveType = _.get(props, ['location', 'query', 'openType'])
        const detail = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'data'])
                        : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'transferItem', 'data'])
                            : _.get(state, ['order', 'returnList', 'data'])
        const detailProducts = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = (stockReceiveType === 'supply') ? _.get(state, ['stockReceive', 'item', 'loading'])
                                : (stockReceiveType === 'transfer') ? _.get(state, ['stockReceive', 'transferItem', 'loading'])
                                    : _.get(state, ['order', 'returnList', 'loading'])
        const list = _.get(state, ['stockReceive', 'list', 'data'])
        const listLoading = _.get(state, ['stockReceive', 'list', 'loading'])
        const historyList = _.get(state, ['stockReceive', 'history', 'data'])
        const historyListLoading = _.get(state, ['stockReceive', 'history', 'loading'])
        const transferList = _.get(state, ['stockReceive', 'transfer', 'data'])
        const transferListLoading = _.get(state, ['stockReceive', 'transfer', 'loading'])
        const transferDetail = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const transferDetailLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const barcodeList = _.get(state, ['stockReceive', 'barcodeList', 'data'])
        const barcodeListLoading = _.get(state, ['stockReceive', 'barcodeList', 'loading'])
        const createLoading = _.get(state, ['stockReceive', 'create', 'loading'])
        const createForm = _.get(state, ['form', 'StockReceiveCreateForm'])
        const historyFilterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const isDefect = _.get(state, ['form', 'StockReceiveCreateForm', 'values', 'isDefect'])
        const productId = _.toNumber(_.get(state, ['form', 'StockReceiveCreateForm', 'values', 'product', 'value', 'id']))
        const filter = filterHelper(list, pathname, query)

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
            historyFilterForm
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
        } else if (currentTab === 'transfer') {
            dispatch(stockTransferListFetchAction(filter))
        } else if (currentTab === 'history') {
            dispatch(stockHistoryListFetchAction(filter))
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
        if (stockReceiveId > ZERO && currentTab === 'receive') {
            if (stockReceiveType === 'supply') {
                dispatch(stockReceiveItemFetchAction(stockReceiveId))
            } else if (stockReceiveType === 'transfer') {
                dispatch(stockTransferItemFetchAction(stockReceiveId))
            } else if (stockReceiveType === 'order_return') {
                dispatch(orderReturnListAction(stockReceiveId))
            }
        } else if (stockReceiveId > ZERO && currentTab === 'transfer') {
            dispatch(stockTransferItemFetchAction(stockReceiveId))
        }
    }),

    withHandlers({
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
            const {location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: {[TAB]: 'history'}})
            dispatch(reset('HistoryFilterForm'))
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, historyFilterForm} = props
            const brand = _.get(historyFilterForm, ['values', 'brand', 'value']) || null
            const type = _.get(historyFilterForm, ['values', 'type', 'value']) || null
            const productType = _.get(historyFilterForm, ['values', 'productType', 'value']) || null
            const product = _.get(historyFilterForm, ['values', 'product', 'value']) || null
            const fromDate = _.get(historyFilterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(historyFilterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [HISTORY_FILTER_OPEN]: false,
                [HISTORY_FILTER_KEY.BRAND]: brand,
                [HISTORY_FILTER_KEY.TYPE]: type,
                [HISTORY_FILTER_KEY.PRODUCT_TYPE]: productType,
                [HISTORY_FILTER_KEY.PRODUCT]: product,
                [HISTORY_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [HISTORY_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleOpenAcceptDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_ACCEPT_DIALOG_OPEN]: true})})
        },

        handleCloseAcceptDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_ACCEPT_DIALOG_OPEN]: false})})
        },

        handleSubmitAcceptDialog: props => () => {
            const {dispatch, filter, location: {pathname}, params, transferList} = props
            const supplyId = _.toInteger(_.get(params, 'stockReceiveId'))
            const currentDetail = _.find(_.get(transferList, 'results'), {'id': supplyId})
            return dispatch(stockTransferItemAcceptAction(_.get(currentDetail, 'id'), _.get(currentDetail, 'stock')))
                    .then(() => {
                        hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_ACCEPT_DIALOG_OPEN]: false})})
                        return dispatch(openSnackbarAction({message: 'Успешно принять'}))
                    })
                    .then(() => {
                        dispatch(stockTransferItemFetchAction(supplyId))
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
                    dispatch(stockReceiveItemFetchAction(supplyId))
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
        params
    } = props
    const detailType = _.get(location, ['query', TYPE])
    const detailId = _.toInteger(_.get(params, 'stockReceiveId'))
    const openAcceptDialog = toBoolean(_.get(location, ['query', STOCK_TRANSFER_ACCEPT_DIALOG_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_CREATE_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const brand = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.BRAND))
    const type = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TYPE))
    const productType = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT_TYPE))
    const product = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT))
    const fromDate = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.FROM_DATE))
    const toDate = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TO_DATE))
    const tab = _.get(location, ['query', TAB]) || STOCK_TAB.STOCK_RECEIVE_DEFAULT_TAB
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleOpenDetail: props.handleOpenDetail
    }

    const historyData = {
        data: _.get(historyList, 'results'),
        historyListLoading
    }

    const transferData = {
        data: _.get(transferList, 'results'),
        transferListLoading
    }

    const transferDetailData = {
        id: detailId,
        data: transferDetail,
        transferDetailLoading
    }

    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading
    }

    const acceptDialog = {
        openAcceptDialog,
        handleOpenAcceptDialog: props.handleOpenAcceptDialog,
        handleCloseAcceptDialog: props.handleCloseAcceptDialog,
        handleSubmitAcceptDialog: props.handleSubmitAcceptDialog
    }
    const createDialog = {
        createLoading,
        openCreateDialog,
        isDefect,
        detailProducts,
        detailLoading,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
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
            fromDate: {
                value: fromDate
            },
            toDate: {
                value: toDate
            },
            productType: {
                value: productType
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

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
                acceptDialog={acceptDialog}
            />
        </Layout>
    )
})

export default StockReceiveList
