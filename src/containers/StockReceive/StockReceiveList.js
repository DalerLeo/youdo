import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {change, reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import TabReceive from '../../components/StockReceive/StockTabReceive'
import sprintf from 'sprintf'
import moment from 'moment'
import {OrderPrint} from '../../components/Order'
import {
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    TAB_RECEIVE_FILTER_OPEN,
    TAB_RECEIVE_FILTER_KEY,
    STOCK_POPVER_DIALOG_OPEN,
    STOCK_RECEIVE_CREATE_DIALOG_OPEN,
    STOCK_RECEIVE_UPDATE_DIALOG_OPEN,
    TAB,
    STOCK_CONFIRM_DIALOG_OPEN,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveHistoryItemFetchAction,
    stockReceiveHistoryReturnItemFetchAction,
    stockTransferListFetchAction,
    stockTransferItemFetchAction,
    stockReceiveTransferItemFetchAction,
    stockTransferItemAcceptAction,
    stockReceiveItemConfirmAction,
    stockReceiveItemReturnAction,
    stockReceiveDeliveryConfirmAction,
    stockReceiveCreateAction,
    stockReceiveUpdateAction
} from '../../actions/stockReceive'
import {
    orderListPintFetchAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const ZERO = 0
const TYPE = 'openType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockReceive', 'list', 'data'])
        const listLoading = _.get(state, ['stockReceive', 'list', 'loading'])
        const detail = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const filterForm = _.get(state, ['form', 'TabReceiveFilterForm'])
        const printList = _.get(state, ['stockReceive', 'print', 'data'])
        const createForm = _.get(state, ['form', 'StockReceiveCreateForm'])
        const printLoading = _.get(state, ['stockReceive', 'print', 'loading'])
        const isDefect = _.get(state, ['form', 'StockReceiveCreateForm', 'values', 'isDefect'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            isDefect,
            filterForm,
            printList,
            createForm,
            printLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openReceiveFilter: null
        }
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        dispatch(stockReceiveListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'stockReceiveId'])
        const nextId = _.get(nextProps, ['params', 'stockReceiveId'])
        return nextId && prevId !== nextId
    }, ({dispatch, params, location}) => {
        const stockReceiveType = _.get(location, ['query', 'openType'])
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        if (stockReceiveType === 'supply') {
            dispatch(stockReceiveHistoryItemFetchAction(stockReceiveId))
        } else if (stockReceiveType === 'transfer') {
            dispatch(stockReceiveTransferItemFetchAction(stockReceiveId))
        } else if (stockReceiveType === 'order_return') {
            dispatch(stockReceiveHistoryReturnItemFetchAction(stockReceiveId))
        } else if (stockReceiveType === 'delivery_return') {
            dispatch(stockTransferItemFetchAction(stockReceiveId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const check = _.get(props, ['createForm', 'values', 'noDefects'])
        const nextCheck = _.get(nextProps, ['createForm', 'values', 'noDefects'])
        const details = _.get(nextProps, 'detail')
        return check !== nextCheck && details
    }, ({dispatch, createForm, detail}) => {
        const checked = _.get(createForm, ['values', 'noDefects'])
        const products = _.get(detail, 'products')
        const form = 'StockReceiveCreateForm'
        if (checked) {
            _.map(products, (item, index) => {
                dispatch(change(form, 'stocks[' + index + ']', {
                    selected: true
                }))
            })
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const check = _.get(props, ['createForm', 'values', 'stocks'])
        const nextCheck = _.get(nextProps, ['createForm', 'values', 'stocks'])
        const details = _.get(nextProps, 'detail')
        return !_.isEqual(check, nextCheck) && details
    }, ({dispatch, createForm, detail}) => {
        const products = _.get(detail, 'products')
        const checkbox = _.get(createForm, ['values', 'stocks'])
        const form = 'StockReceiveCreateForm'
        const indexesOfChecked = _.filter(_.map(checkbox, (item, index) => {
            if (_.get(item, 'selected')) {
                return index
            }
            return null
        }), item => item !== null)
        _.map(products, (item, index) => {
            if (_.includes(indexesOfChecked, index)) {
                dispatch(change(form, 'product[' + index + ']', {
                    accepted: _.toNumber(_.get(item, 'amount')),
                    defected: null
                }))
            }
        })
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
            hashHistory.push({pathname, query: filter.getParams({[TAB_RECEIVE_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TAB_RECEIVE_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname, query}} = props
            const currentTab = _.get(query, 'tab') || 'receive'
            hashHistory.push({pathname, query: {[TAB]: currentTab}})
        },

        handleSubmitTabReceiveFilterDialog: props => () => {
            const {filter, filterForm} = props
            const stock = _.get(filterForm, ['values', 'stock']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const acceptedBy = _.get(filterForm, ['values', 'acceptedBy']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [TAB_RECEIVE_FILTER_OPEN]: false,
                [TAB_TRANSFER_FILTER_KEY.STOCK]: joinArray(stock),
                [TAB_TRANSFER_FILTER_KEY.TYPE]: type,
                [TAB_TRANSFER_FILTER_KEY.ACCEPTED_BY]: joinArray(acceptedBy),
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
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
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
                    return dispatch(openSnackbarAction({message: 'Успешно принято'}))
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
                    return dispatch(openSnackbarAction({message: 'Запрос отменен'}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitReceiveDeliveryConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}} = props
            const id = _.toInteger(_.get(props, ['location', 'query', 'orderId']))
            return dispatch(stockReceiveDeliveryConfirmAction(id, 'cancel'))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_CONFIRM_DIALOG_OPEN]: false})})
                    dispatch(stockReceiveListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно подтверждено'}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
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
                        [STOCK_POPVER_DIALOG_OPEN]: id
                    })
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.STOCK_RECEIVE_ITEM_PATH, id),
                    query: filter.getParams({
                        [TYPE]: type,
                        orderId: typeOrg
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
                    return dispatch(openErrorAction({message: error}))
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
                    return dispatch(openErrorAction({message: error}))
                })
        },
        handleCheckNoDefect: props => () => {
            const {dispatch, createForm} = props
            const form = 'StockReceiveCreateForm'
            const checked = _.get(createForm, ['values', 'noDefects'])
            if (checked) {
                dispatch(reset(form))
            }
        }
    })
)

const StockReceiveListContent = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        detail,
        detailLoading,
        filter,
        layout,
        openPrint,
        printList,
        printLoading,
        isDefect,
        params,
        createLoading,
        detailProducts
    } = props

    const detailType = _.get(location, ['query', TYPE])
    const openCreateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STOCK_RECEIVE_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'stockReceiveId'))
    const openConfirmDialog = _.toInteger(_.get(location, ['query', STOCK_CONFIRM_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', TAB_RECEIVE_FILTER_OPEN]))
    const stock = (filter.getParam(TAB_RECEIVE_FILTER_KEY.STOCK))
    const type = (filter.getParam(TAB_RECEIVE_FILTER_KEY.TYPE))
    const acceptedBy = (filter.getParam(TAB_RECEIVE_FILTER_KEY.ACCEPTED_BY))
    const fromDate = filter.getParam(TAB_RECEIVE_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(TAB_RECEIVE_FILTER_KEY.TO_DATE)
    const handleCloseDetail = _.get(props, 'handleCloseDetail')

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleOpenDetail: props.handleOpenDetail
    }

    const orderData = {
        data: printList,
        printLoading
    }

    const currentDetail = _.find(_.get(list, 'results'), (obj) => {
        return _.get(obj, 'id') === detailId && _.get(obj, 'type') === detailType
    })

    const detailData = {
        type: detailType,
        id: detailId,
        data: detail,
        detailLoading,
        currentDetail
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
    const filterDialog = {
        initialValues: {
            type: {value: type},
            acceptedBy: acceptedBy && splitToArray(acceptedBy),
            date: {
                fromDate: fromDate && moment(fromDate),
                toDate: toDate && moment(toDate)
            },
            stock: stock && splitToArray(stock)
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
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                handleCloseDetail={handleCloseDetail}
                filterDialog={filterDialog}
                createDialog={createDialog}
                updateDialog={updateDialog}
                handleCheckNoDefect={props.handleCheckNoDefect}
                history={false}/>
        </Layout>
    )
})

export default StockReceiveListContent
