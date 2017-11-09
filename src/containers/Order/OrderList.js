import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset, change} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import numberFormat from '../../helpers/numberFormat'
import toBoolean from '../../helpers/toBoolean'
import * as ORDER_TAB from '../../constants/orderTab'
import {openErrorAction} from '../../actions/error'

import {
    ORDER_CREATE_DIALOG_OPEN,
    ORDER_UPDATE_DIALOG_OPEN,
    ORDER_FILTER_KEY,
    ORDER_FILTER_OPEN,
    ORDER_TRANSACTIONS_DIALOG_OPEN,
    ORDER_ITEM_RETURN_DIALOG_OPEN,
    ORDER_RETURN_DIALOG_OPEN,
    ORDER_SHORTAGE_DIALOG_OPEN,
    TAB,
    OrderGridList,
    OrderPrint
} from '../../components/Order'
const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'
const CANCEL_ORDER_RETURN_DIALOG_OPEN = 'openCancelConfirmDialog'
import {
    orderCreateAction,
    orderUpdateAction,
    orderListFetchAction,
    orderDeleteAction,
    orderItemFetchAction,
    orderReturnAction,
    orderReturnListAction,
    orderTransactionFetchAction,
    orderItemReturnFetchAction,
    orderListPintFetchAction,
    orderReturnCancelAction,
    orderProductMobileAction,
    orderSetDiscountAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'

const MINUS_ONE = -1
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const payment = _.get(state, ['order', 'payment', 'data'])
        const paymentLoading = _.get(state, ['order', 'payment', 'loading'])
        const orderReturnList = _.get(state, ['order', 'returnList', 'data'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const createLoading = _.get(state, ['order', 'create', 'loading'])
        const createClientLoading = _.get(state, ['client', 'create', 'loading'])
        const returnDialogLoading = _.get(state, ['order', 'returnList', 'loading'])
        const shortageLoading = _.get(state, ['order', 'create', 'loading'])
        const updateLoading = _.get(state, ['order', 'update', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listPrint = _.get(state, ['order', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['order', 'listPrint', 'loading'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'OrderFilterForm'])
        const createForm = _.get(state, ['form', 'OrderCreateForm'])
        const clientCreateForm = _.get(state, ['form', 'ClientCreateForm'])
        const discountCreateForm = _.get(state, ['form', 'OrderSetDiscountForm'])
        const returnForm = _.get(state, ['form', 'OrderReturnForm'])
        const returnData = _.get(state, ['order', 'return', 'data', 'results'])
        const returnLoading = _.get(state, ['order', 'return', 'loading'])
        const returnDataLoading = _.get(state, ['order', 'return', 'loading'])
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        const editProducts = _.get(state, ['order', 'updateProducts', 'data', 'results'])
        const editProductsLoading = _.get(state, ['order', 'updateProducts', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const userGroups = _.get(state, ['authConfirm', 'data', 'groups'])
        const defaultUser = _.get(state, ['authConfirm', 'data', 'id'])
        const selectedProduct = _.get(state, ['form', 'OrderCreateForm', 'values', 'product', 'value'])
        const paymentType = _.get(state, ['form', 'OrderCreateForm', 'values', 'paymentType'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])

        return {
            list,
            listLoading,
            detail,
            payment,
            listPrintLoading,
            listPrint,
            detailLoading,
            createLoading,
            createClientLoading,
            shortageLoading,
            updateLoading,
            filter,
            filterForm,
            paymentLoading,
            createForm,
            clientCreateForm,
            returnForm,
            returnData,
            orderReturnList,
            returnLoading,
            returnDataLoading,
            returnDialogLoading,
            products,
            editProducts,
            userGroups,
            discountCreateForm,
            defaultUser,
            selectedProduct,
            paymentType,
            isSuperUser,
            editProductsLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            showCheckboxes: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return (_.get(props, ['selectedProduct', 'id']) !== _.get(nextProps, ['selectedProduct', 'id']) && _.get(nextProps, ['selectedProduct', 'id'])) ||
            (_.get(props, 'paymentType') !== _.get(nextProps, 'paymentType'))
    }, ({dispatch, selectedProduct, paymentType}) => {
        const customPrice = _.get(selectedProduct, 'customPrice')
        if (selectedProduct && !customPrice && paymentType) {
            const price = paymentType === 'cash' ? _.toNumber(_.get(selectedProduct, 'cashPrice')) : _.toNumber(_.get(selectedProduct, 'transferPrice'))
            dispatch(change('OrderCreateForm', 'cost', price))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevTransaction = toBoolean(_.get(props, ['location', 'query', 'openTransactionsDialog']))
        const nextTransaction = toBoolean(_.get(nextProps, ['location', 'query', 'openTransactionsDialog']))
        return prevTransaction !== nextTransaction && nextTransaction === true
    }, ({dispatch, params, location}) => {
        const openTransaction = toBoolean(_.get(location, ['query', 'openTransactionsDialog']))
        const orderId = _.toInteger(_.get(params, 'orderId'))
        if (orderId > ZERO && openTransaction) {
            dispatch(orderTransactionFetchAction(orderId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevOrderId = _.get(props, ['params', 'orderId'])
        const nextOrderId = _.get(nextProps, ['params', 'orderId'])
        const prevTab = _.get(props, ['location', 'query', 'tab'])
        const nextTab = _.get(nextProps, ['location', 'query', 'tab'])
        return (prevOrderId !== nextOrderId || prevTab !== nextTab) && nextTab === 'return'
    }, ({dispatch, params, location}) => {
        const returnTab = _.get(location, ['query', TAB])
        const orderId = _.toInteger(_.get(params, 'orderId'))
        if (orderId > ZERO && returnTab === ORDER_TAB.ORDER_TAB_RETURN) {
            dispatch(orderItemReturnFetchAction(orderId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const orderId = _.get(nextProps, ['params', 'orderId'])

        return orderId && _.get(props, ['params', 'orderId']) !== orderId
    }, ({dispatch, params}) => {
        const orderId = _.toInteger(_.get(params, 'orderId'))
        orderId && dispatch(orderItemFetchAction(orderId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevReturn = _.toInteger(_.get(props, ['location', 'query', 'openOrderItemReturnDialog']))
        const nextReturn = _.toInteger(_.get(nextProps, ['location', 'query', 'openOrderItemReturnDialog']))
        return prevReturn !== nextReturn && nextReturn > ZERO
    }, ({dispatch, location}) => {
        const returnItemId = _.toInteger(_.get(location, ['query', 'openOrderItemReturnDialog']))
        if (returnItemId > ZERO) {
            dispatch(orderReturnListAction(returnItemId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'detailLoading')
        const nextLoading = _.get(nextProps, 'detailLoading')
        const update = toBoolean(_.get(props, ['location', 'query', ORDER_UPDATE_DIALOG_OPEN]))
        const nextUpdate = toBoolean(_.get(nextProps, ['location', 'query', ORDER_UPDATE_DIALOG_OPEN]))

        return (prevLoading !== nextLoading && nextLoading === false && nextUpdate === true) ||
            (update !== nextUpdate && nextUpdate === true)
    }, ({dispatch, params, location, detail}) => {
        const orderId = _.toInteger(_.get(params, 'orderId'))
        const priceList = _.toInteger(_.get(detail, ['priceList', 'id']))
        const openUpdate = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
        if (orderId > ZERO && priceList > ZERO && openUpdate) {
            const size = 100
            dispatch(orderProductMobileAction(orderId, priceList, size))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevPriceList = _.get(props, ['createForm', 'values', 'priceList', 'value'])
        const nextPriceList = _.get(nextProps, ['createForm', 'values', 'priceList', 'value'])
        const openCreateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_CREATE_DIALOG_OPEN]))
        const openUpdateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_UPDATE_DIALOG_OPEN]))

        return (prevPriceList !== nextPriceList && nextPriceList && (openCreateDialog || openUpdateDialog))
    }, ({dispatch, location, createForm}) => {
        const priceList = _.toInteger(_.get(createForm, ['values', 'priceList', 'value']))
        const products = _.join(_.map(_.get(createForm, ['values', 'products']), (item) => {
            return _.get(item, ['product', 'value', 'id'])
        }), '-')
        const openUpdate = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
        if (priceList > ZERO && openUpdate) {
            const size = 100
            dispatch(orderProductMobileAction(null, priceList, size, products))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openPrint', 'setOpenPrint', false),

    withHandlers({
        handleOpenPrintDialog: props => () => {
            const {setOpenPrint, dispatch, filter} = props
            setOpenPrint(true)
            dispatch(orderListPintFetchAction(filter))
                .then(() => {
                    window.print()
                })
        },

        handleClosePrintDialog: props => () => {
            const {setOpenPrint} = props
            setOpenPrint(false)
        },

        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        },

        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog, filter} = props
            dispatch(orderDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(orderListFetchAction(filter))
                    dispatch(orderItemFetchAction(detail.id))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            dispatch(reset('OrderFilterForm'))
            hashHistory.push({pathname, query: filter.getParams({[ORDER_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'data', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'data', 'toDate']) || null
            const deliveryFromDate = _.get(filterForm, ['values', 'deliveryDate', 'fromDate']) || null
            const deliveryToDate = _.get(filterForm, ['values', 'deliveryDate', 'toDate']) || null
            const deadlineFromDate = _.get(filterForm, ['values', 'deadlineDate', 'fromDate']) || null
            const deadlineToDate = _.get(filterForm, ['values', 'deadlineDate', 'toDate']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const shop = _.get(filterForm, ['values', 'shop', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const zone = _.get(filterForm, ['values', 'zone', 'value']) || null
            const dept = _.get(filterForm, ['values', 'dept', 'value']) || null
            const initiator = _.get(filterForm, ['values', 'initiator', 'value']) || null
            const deliveryMan = _.get(filterForm, ['values', 'deliveryMan', 'value']) || null
            const onlyBonus = _.get(filterForm, ['values', 'onlyBonus']) || null
            const exclude = _.get(filterForm, ['values', 'exclude']) || null

            filter.filterBy({
                [ORDER_FILTER_OPEN]: false,
                [ORDER_FILTER_KEY.CLIENT]: client,
                [ORDER_FILTER_KEY.STATUS]: status,
                [ORDER_FILTER_KEY.PRODUCT]: product,
                [ORDER_FILTER_KEY.INITIATOR]: initiator,
                [ORDER_FILTER_KEY.ZONE]: zone,
                [ORDER_FILTER_KEY.SHOP]: shop,
                [ORDER_FILTER_KEY.DIVISION]: division,
                [ORDER_FILTER_KEY.DEPT]: dept,
                [ORDER_FILTER_KEY.ONLY_BONUS]: onlyBonus,
                [ORDER_FILTER_KEY.EXCLUDE]: exclude,
                [ORDER_FILTER_KEY.DELIVERY_MAN]: deliveryMan,
                [ORDER_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.DEADLINE_FROM_DATE]: deadlineFromDate && deadlineFromDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.DEADLINE_TO_DATE]: deadlineToDate && deadlineToDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.DELIVERY_FROM_DATE]: deliveryFromDate && deliveryFromDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.DELIVERY_TO_DATE]: deliveryToDate && deliveryToDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('OrderCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(orderCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_CREATE_DIALOG_OPEN]: false})})
                    dispatch(orderListFetchAction(filter))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenTransactionsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_TRANSACTIONS_DIALOG_OPEN]: true})})
        },

        handleCloseTransactionsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_TRANSACTIONS_DIALOG_OPEN]: false})})
        },

        handleOpenItemReturnDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_ITEM_RETURN_DIALOG_OPEN]: id})})
        },

        handleCloseItemReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_ITEM_RETURN_DIALOG_OPEN]: MINUS_ONE})})
        },

        handleOpenReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_RETURN_DIALOG_OPEN]: true})})
        },

        handleCloseReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_RETURN_DIALOG_OPEN]: false})})
        },
        handleSubmitReturnDialog: props => () => {
            const {dispatch, returnForm, detail, filter, location: {pathname}, params} = props
            const orderId = _.toInteger(_.get(params, 'orderId'))
            return dispatch(orderReturnAction(_.get(returnForm, ['values']), detail))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_RETURN_DIALOG_OPEN]: false})})
                    dispatch(orderItemReturnFetchAction(orderId))
                    dispatch(orderItemFetchAction(orderId))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                                {errorWhole}
                            </div>
                    }))
                })
        },
        handleOpenCancelOrderReturnDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_ORDER_RETURN_DIALOG_OPEN]: id})})
        },

        handleCloseCancelOrderReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_ORDER_RETURN_DIALOG_OPEN]: false})})
        },
        handleSubmitCancelOrderReturnDialog: props => () => {
            const {dispatch, filter, params, location: {pathname, query}} = props
            const orderReturnId = _.toInteger(_.get(query, CANCEL_ORDER_RETURN_DIALOG_OPEN))
            const orderId = _.toInteger(_.get(params, 'orderId'))
            return dispatch(orderReturnCancelAction(orderReturnId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отменена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CANCEL_ORDER_RETURN_DIALOG_OPEN]: false})})
                    dispatch(orderItemReturnFetchAction(orderId))
                    dispatch(orderItemFetchAction(orderId))
                })
        },

        handleOpenShortageDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_SHORTAGE_DIALOG_OPEN]: true})})
        },

        handleCloseShortageDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_SHORTAGE_DIALOG_OPEN]: false})})
        },
        handleSubmitShortageDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props
            return dispatch(orderCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отправлено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({
                            [ORDER_SHORTAGE_DIALOG_OPEN]: false,
                            [ORDER_CREATE_DIALOG_OPEN]: false
                        })
                    })
                    dispatch(orderListFetchAction(filter))
                }).catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}><b style={{textTransform: 'uppercase'}}>{index}:</b> {item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props
            const orderId = _.toInteger(_.get(props, ['params', 'orderId']))

            return dispatch(orderUpdateAction(orderId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(orderItemFetchAction(orderId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_UPDATE_DIALOG_OPEN]: false})})
                    dispatch(orderListFetchAction(filter))
                }).catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                                {errorWhole}
                            </div>
                    }))
                })
        },
        handleOpenCreateClientDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: [ROUTER.SHOP_LIST_URL], query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: true})})
        },
        handleGetDocument: props => (id) => {
            const {dispatch, filter, setOpenPrint} = props
            setOpenPrint(true)
            return dispatch(orderListPintFetchAction(filter, id))
                .then(() => {
                    window.print()
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.ORDER_LIST_URL, query: filter.getParams()})
        },
        handleRefreshList: props => () => {
            const {dispatch, filter} = props
            return dispatch(orderListFetchAction(filter))
        },
        handleSubmitDiscountDialog: props => (id) => {
            const {dispatch, discountCreateForm} = props
            return dispatch(orderSetDiscountAction(id, _.get(discountCreateForm, ['values', 'percent'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Скидка добавлена'}))
                })
                .then(() => {
                    return dispatch(orderItemFetchAction(id))
                }).catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}><b style={{textTransform: 'uppercase'}}>{index}:</b> {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },
        handleSubmitSetZeroDiscountDialog: props => (id) => {
            const {dispatch} = props
            return dispatch(orderSetDiscountAction(id, ZERO))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Скидка отменена'}))
                })
                .then(() => {
                    return dispatch(orderItemFetchAction(id))
                }).catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}><b style={{textTransform: 'uppercase'}}>{index}:</b> {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        }
    }),
)

const OrderList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        returnData,
        orderReturnList,
        payment,
        detailLoading,
        createLoading,
        returnLoading,
        shortageLoading,
        updateLoading,
        returnDataLoading,
        returnDialogLoading,
        filter,
        layout,
        products,
        openPrint,
        paymentLoading,
        params,
        listPrint,
        listPrintLoading,
        userGroups,
        defaultUser,
        isSuperUser,
        editProducts,
        editProductsLoading
    } = props
    const openFilterDialog = toBoolean(_.get(location, ['query', ORDER_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', ORDER_CREATE_DIALOG_OPEN]))
    const openTransactionsDialog = toBoolean(_.get(location, ['query', ORDER_TRANSACTIONS_DIALOG_OPEN]))
    const openOrderItemReturnDialog = _.toInteger(_.get(location, ['query', 'openOrderItemReturnDialog']) || MINUS_ONE) > MINUS_ONE
    const openReturnDialog = toBoolean(_.get(location, ['query', ORDER_RETURN_DIALOG_OPEN]))
    const openShortageDialog = toBoolean(_.get(location, ['query', ORDER_SHORTAGE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
    const openCancelOrderReturnDialog = _.toInteger(_.get(location, ['query', CANCEL_ORDER_RETURN_DIALOG_OPEN]))

    const client = _.toInteger(filter.getParam(ORDER_FILTER_KEY.CLIENT))
    const dept = _.toInteger(filter.getParam(ORDER_FILTER_KEY.DEPT))
    const initiator = _.toInteger(filter.getParam(ORDER_FILTER_KEY.INITIATOR))
    const zone = _.toInteger(filter.getParam(ORDER_FILTER_KEY.ZONE))
    const deliveryMan = _.toInteger(filter.getParam(ORDER_FILTER_KEY.DELIVERY_MAN))
    const orderStatus = _.toInteger(filter.getParam(ORDER_FILTER_KEY.STATUS))
    const shop = _.toInteger(filter.getParam(ORDER_FILTER_KEY.SHOP))
    const product = _.toInteger(filter.getParam(ORDER_FILTER_KEY.PRODUCT))
    const division = _.toInteger(filter.getParam(ORDER_FILTER_KEY.DIVISION))
    const status = _.toInteger(filter.getParam(ORDER_FILTER_KEY.STATUS))
    const toDate = filter.getParam(ORDER_FILTER_KEY.TO_DATE)
    const fromDate = filter.getParam(ORDER_FILTER_KEY.FROM_DATE)
    const deliveryFromDate = filter.getParam(ORDER_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(ORDER_FILTER_KEY.DELIVERY_TO_DATE)
    const deadlineFromDate = filter.getParam(ORDER_FILTER_KEY.DEADLINE_FROM_DATE)
    const deadlineToDate = filter.getParam(ORDER_FILTER_KEY.DEADLINE_TO_DATE)
    const onlyBonus = filter.getParam(ORDER_FILTER_KEY.ONLY_BONUS)
    const exclude = filter.getParam(ORDER_FILTER_KEY.EXCLUDE)

    const detailId = _.toInteger(_.get(params, 'orderId'))
    const tab = _.get(location, ['query', TAB]) || ORDER_TAB.ORDER_DEFAULT_TAB

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const transactionsDialog = {
        openTransactionsDialog,
        handleOpenTransactionsDialog: props.handleOpenTransactionsDialog,
        handleCloseTransactionsDialog: props.handleCloseTransactionsDialog
    }

    const cancelOrderReturnDialog = {
        openCancelOrderReturnDialog,
        handleOpenCancelOrderReturnDialog: props.handleOpenCancelOrderReturnDialog,
        handleCloseCancelOrderReturnDialog: props.handleCloseCancelOrderReturnDialog,
        handleSubmitCancelOrderReturnDialog: props.handleSubmitCancelOrderReturnDialog
    }
    const itemReturnDialog = {
        returnDialogLoading,
        openOrderItemReturnDialog,
        handleOpenItemReturnDialog: props.handleOpenItemReturnDialog,
        handleCloseItemReturnDialog: props.handleCloseItemReturnDialog
    }

    const returnDialog = {
        returnLoading,
        openReturnDialog,
        handleOpenReturnDialog: props.handleOpenReturnDialog,
        handleCloseReturnDialog: props.handleCloseReturnDialog,
        handleSubmitReturnDialog: props.handleSubmitReturnDialog
    }
    const shortageDialog = {
        shortageLoading,
        openShortageDialog,
        handleOpenShortageDialog: props.handleOpenShortageDialog,
        handleCloseShortageDialog: props.handleCloseShortageDialog,
        handleSubmitShortageDialog: props.handleSubmitShortageDialog
    }

    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const createClientDialog = {
        handleOpenCreateClientDialog: props.handleOpenCreateClientDialog
    }

    const withoutBonusProducts = _.filter(_.get(detail, 'products'), {'isBonus': false})
    const getBalance = (id) => {
        const foundProduct = _.find(editProducts, {'id': id})
        return _.toInteger(_.get(foundProduct, 'balance'))
    }
    const getPrice = (id) => {
        const foundProduct = _.find(editProducts, {'id': id})
        return {
            cashPrice: _.get(foundProduct, 'cashPrice'),
            transferPrice: _.get(foundProduct, 'transferPrice')
        }
    }
    const forUpdateProducts = _.map(withoutBonusProducts, (item) => {
        return {
            amount: _.get(item, 'amount'),
            cost: _.get(item, 'price'),
            customPrice: _.get(item, ['product', 'customPrice']),
            price: getPrice(_.get(item, ['product', 'id'])),
            product: {
                id: _.get(item, 'id'),
                value: {
                    id: _.get(item, ['product', 'id']),
                    name: _.get(item, ['product', 'name']),
                    balance: getBalance(_.get(item, ['product', 'id'])),
                    measurement: {
                        id: _.get(item, ['product', 'measurement', 'id']),
                        name: _.get(item, ['product', 'measurement', 'name'])
                    }
                },
                text: _.get(item, ['product', 'name'])
            }

        }
    })
    const updateDialog = {
        initialValues: (() => {
            if (openCreateDialog) {
                return {
                    user: {
                        value: defaultUser
                    }
                }
            }
            const ONE = 1
            const HUND = 100
            const discountPrice = _.toNumber(_.get(detail, 'discountPrice'))
            const totalPrice = _.toNumber(_.get(detail, 'totalPrice'))
            const discount = (discountPrice / (discountPrice + totalPrice)) * HUND

            const deliveryType = _.toInteger(_.get(detail, ['deliveryType', 'id']))
            let deliveryTypeText = 'Доставка'
            if (deliveryType === ZERO) {
                deliveryTypeText = 'Самовывоз'
            }
            const dealType = _.toInteger(_.get(detail, 'dealType')) === ONE ? 'consignment' : 'standart'
            const paymentType = _.get(detail, 'paymentType')
            return {
                client: {
                    value: _.toInteger(_.get(detail, ['client', 'id']))
                },
                contact: {
                    value: _.toInteger(_.get(detail, ['contact', 'id']))
                },
                market: {
                    value: _.toInteger(_.get(detail, ['market', 'id']))
                },
                deliveryMan: {
                    value: _.get(detail, ['deliveryMan', 'id'])
                },
                deliveryType: {
                    value: deliveryType,
                    text: deliveryTypeText
                },
                dealType: dealType,
                paymentType: paymentType,
                deliveryDate: moment(_.get(detail, ['dateDelivery'])).toDate(),
                deliveryPrice: numberFormat(_.get(detail, 'deliveryPrice')),
                discountPrice: discount,
                paymentDate: moment(_.get(detail, ['paymentDate'])).toDate(),
                products: forUpdateProducts,
                priceList: {
                    value: _.get(detail, ['priceList', 'id']),
                    text: _.get(detail, ['priceList', 'name'])
                },
                user: {
                    value: _.get(detail, ['user', 'id'])
                }
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        editProductsLoading,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            client: {
                value: client
            },
            orderStatus: {
                value: orderStatus
            },
            division: {
                value: division
            },
            status: {
                value: status
            },
            shop: {
                value: shop
            },
            product: {
                value: product
            },
            initiator: {
                value: initiator
            },
            dept: {
                value: dept
            },
            zone: {
                value: zone
            },
            deliveryMan: {
                value: deliveryMan
            },
            deliveryDate: {
                deliveryFromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                deliveryToDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
            },
            deadlineDate: {
                deadlineFromDate: deadlineFromDate && moment(deadlineFromDate, 'YYYY-MM-DD'),
                deadlineToDate: deadlineToDate && moment(deadlineToDate, 'YYYY-MM-DD')
            },
            onlyBonus: onlyBonus,
            exclude: exclude,
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }
    const listPrintData = {
        data: listPrint,
        listPrintLoading
    }
    const listData = {
        data: _.get(list, 'results') || {},
        listLoading
    }

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const detailData = {
        id: detailId,
        data: detail || {},
        return: returnData || [],
        returnLoading: returnDataLoading,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const paymentData = {
        id: detailId,
        data: payment || {},
        paymentLoading
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
            listPrintData={listPrintData}/>
    }

    const canChangeAnyPrice = !_.isEmpty(_.filter(userGroups, (o) => {
        return o.name === 'change_any_price'
    }))

    document.getElementById('wrapper').style.height = '100%'
    const order = true
    return (
        <Layout {...layout}>
            <OrderGridList
                filter={filter}
                listData={listData}
                tabData={tabData}
                detailData={detailData}
                returnListData={orderReturnList || {}}
                paymentData={paymentData}
                createDialog={createDialog}
                getDocument={getDocument}
                createClientDialog={createClientDialog}
                transactionsDialog={transactionsDialog}
                itemReturnDialog={itemReturnDialog}
                returnDialog={returnDialog}
                shortageDialog={shortageDialog}
                confirmDialog={confirmDialog}
                returnDataLoading={returnDataLoading}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
                products={products}
                printDialog={printDialog}
                type={order}
                refreshAction={props.handleRefreshList}
                cancelOrderReturnDialog={cancelOrderReturnDialog}
                canChangeAnyPrice={canChangeAnyPrice}
                handleSubmitDiscountDialog={props.handleSubmitDiscountDialog}
                handleSubmitSetZeroDiscountDialog={props.handleSubmitSetZeroDiscountDialog}
                isSuperUser={isSuperUser}
            />
        </Layout>
    )
})

export default OrderList
