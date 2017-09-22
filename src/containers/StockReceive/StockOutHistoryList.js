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
import {
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
    stockReceiveCreateAction,
    stockHistoryListFetchAction,
    stockTransferListFetchAction,
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
import StockTabHistory from '../../components/StockReceive/StockTabHistory'

const TYPE = 'openType'
const POP_TYPE = 'popType'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockReceive', 'history', 'data'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const listLoading = _.get(state, ['stockReceive', 'history', 'loading'])
        const filterForm = _.get(state, ['form', 'HistoryFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        dispatch(stockHistoryListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockReceiveId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockReceiveId']))
        return prevId !== nextId
    }, ({dispatch, params}) => {
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        dispatch(stockReceiveOrderItemFetchAction(stockReceiveId))
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
        dispatch(historyOrderItemFetchAction(_.toNumber(dialog)))
    }),

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

const StockOutHistory = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        filter,
        layout,
        detail,
        detailLoading
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
        detailLoading,
        data: _.get(list, 'results'),
        detailData: {
            data: detail || {},
            id: openHistoryInfoDialog
        }
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

    return (
        <Layout {...layout}>
            <StockTabHistory
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

export default StockOutHistory
