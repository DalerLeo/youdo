import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset, change} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import * as actionTypes from '../../constants/actionTypes'
import filterHelper from '../../helpers/filter'
import numberFormat from '../../helpers/numberFormat'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import toBoolean from '../../helpers/toBoolean'
import checkPermission from '../../helpers/checkPermission'
import getDocuments from '../../helpers/getDocument'
import * as ORDER_TAB from '../../constants/orderTab'
import * as serializers from '../../serializers/orderSerializer'
import * as API from '../../constants/api'
import {openErrorAction} from '../../actions/error'
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
    orderSetDiscountAction,
    orderGetCounts,
    orderMultiUpdateAction,
    orderAddProductsListAction,
    orderChangePriceListAction,
    orderChangeCurrencyListAction,
    orderSalesPrintFetchAction,
    orderCheckDeliveryAction
} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
import updateStore from '../../helpers/updateStore'
import {shopItemFetchAction} from '../../actions/shop'
import {
    ORDER_CREATE_DIALOG_OPEN,
    ORDER_UPDATE_DIALOG_OPEN,
    ORDER_FILTER_KEY,
    ORDER_FILTER_OPEN,
    ORDER_TRANSACTIONS_DIALOG_OPEN,
    ORDER_RETURN_DIALOG_OPEN,
    ORDER_SHORTAGE_DIALOG_OPEN,
    ORDER_MULTI_EDIT_OPEN,
    ORDER_RELEASE_DIALOG_OPEN,
    TAB,
    OrderGridList,
    OrderPrint,
    OrderSalesPrint,
    OrderContractPrint
} from '../../components/Order'
import t from '../../helpers/translate'
import {
    ZERO,
    ORDER_GIVEN,
    ORDER_DELIVERED,
    ORDER_CANCELED,
    ORDER_NOT_CONFIRMED
} from '../../constants/backendConstants'

const CLIENT_CREATE_DIALOG_OPEN = 'openCreateDialog'
const CANCEL_ORDER_RETURN_DIALOG_OPEN = 'openCancelConfirmDialog'
const MINUS_ONE = -1
const HUNDRED = 1000
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
        const orderCounts = _.get(state, ['order', 'counts', 'data'])
        const orderCountsLoading = _.get(state, ['order', 'counts', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const listPrint = _.get(state, ['order', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['order', 'listPrint', 'loading'])
        const filterForm = _.get(state, ['form', 'OrderFilterForm'])
        const createForm = _.get(state, ['form', 'OrderCreateForm'])
        const multiUpdateForm = _.get(state, ['form', 'OrderMultiUpdateForm'])
        const releaseForm = _.get(state, ['form', 'OrderReleaseUpdateForm'])
        const clientCreateForm = _.get(state, ['form', 'ClientCreateForm'])
        const discountCreateForm = _.get(state, ['form', 'OrderSetDiscountForm'])
        const returnForm = _.get(state, ['form', 'OrderReturnForm'])
        const returnData = _.get(state, ['order', 'return', 'data', 'results'])
        const returnLoading = _.get(state, ['order', 'return', 'loading'])
        const returnDataLoading = _.get(state, ['order', 'return', 'loading'])
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        const editProducts = _.get(state, ['order', 'updateProducts', 'data'])
        const editProductsLoading = _.get(state, ['order', 'updateProducts', 'loading'])
        const salesPrintData = _.get(state, ['order', 'salesPrint', 'data'])
        const marketDetails = _.get(state, ['shop', 'item', 'data'])
        const marketDetailsLoading = _.get(state, ['shop', 'item', 'loading'])
        const salesPrintDataLoading = _.get(state, ['order', 'salesPrint', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const filterProducts = filterHelper(editProducts, pathname, query, {'page': 'pdPage', 'pageSize': 'pdPageSize'})
        const defaultUser = _.get(state, ['authConfirm', 'data', 'id'])
        const selectedProduct = _.get(state, ['form', 'OrderCreateForm', 'values', 'product', 'value'])
        const paymentType = _.get(state, ['form', 'OrderCreateForm', 'values', 'paymentType'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const addProductsForm = _.get(state, ['form', 'OrderAddProductsForm'])

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
            multiUpdateForm,
            clientCreateForm,
            returnForm,
            returnData,
            orderReturnList,
            returnLoading,
            returnDataLoading,
            returnDialogLoading,
            products,
            editProducts,
            discountCreateForm,
            defaultUser,
            selectedProduct,
            paymentType,
            isSuperUser,
            editProductsLoading,
            orderCounts,
            orderCountsLoading,
            releaseForm,
            filterProducts,
            addProductsForm,
            salesPrintData,
            salesPrintDataLoading,
            marketDetails,
            marketDetailsLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            pdPage: null,
            pdPageSize: null,
            pdSearch: null,
            showCheckboxes: null,
            openMultiEdit: null,
            openReleaseDialog: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter))
        dispatch(orderGetCounts())
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
        const size = _.get(location, ['query', 'pdPageSize'])
        const openUpdate = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
        if (orderId > ZERO && priceList > ZERO && openUpdate) {
            dispatch(orderProductMobileAction(orderId, priceList, size))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevPriceList = _.get(props, ['createForm', 'values', 'priceList', 'value'])
        const nextPriceList = _.get(nextProps, ['createForm', 'values', 'priceList', 'value'])
        const openCreateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_CREATE_DIALOG_OPEN]))
        const openUpdateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_UPDATE_DIALOG_OPEN]))

        return (prevPriceList !== nextPriceList && nextPriceList && (openCreateDialog === true || openUpdateDialog === true))
    }, ({dispatch, createForm, location}) => {
        const priceList = _.toInteger(_.get(createForm, ['values', 'priceList', 'value']))
        const currency = _.toInteger(_.get(createForm, ['values', 'currency', 'value']))
        const size = _.get(location, ['query', 'pdPageSize'])
        const products = _.join(_.map(_.get(createForm, ['values', 'products']), (item) => {
            return _.get(item, ['product', 'value', 'id'])
        }), '-')
        if ((priceList > ZERO || priceList === MINUS_ONE) && products) {
            dispatch(orderChangePriceListAction(null, priceList, size, products, currency))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCurrency = _.get(props, ['createForm', 'values', 'currency', 'value'])
        const nextCurrency = _.get(nextProps, ['createForm', 'values', 'currency', 'value'])
        const openCreateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_CREATE_DIALOG_OPEN]))
        const openUpdateDialog = toBoolean(_.get(nextProps, ['location', 'query', ORDER_UPDATE_DIALOG_OPEN]))

        return (prevCurrency !== nextCurrency && nextCurrency && (openCreateDialog === true || openUpdateDialog === true))
    }, ({dispatch, createForm, location}) => {
        const currency = _.toInteger(_.get(createForm, ['values', 'currency', 'value']))
        const priceList = _.toInteger(_.get(createForm, ['values', 'priceList', 'value']))
        const size = _.get(location, ['query', 'pdPageSize'])
        const products = _.join(_.map(_.get(createForm, ['values', 'products']), (item) => {
            return _.get(item, ['product', 'value', 'id'])
        }), '-')
        if (currency > ZERO && (priceList > ZERO || priceList === MINUS_ONE)) {
            dispatch(orderChangeCurrencyListAction(null, priceList, size, products, currency))
        }
    }),

    withState('openAddProductDialog', 'setOpenAddProductDialog', false),
    withState('openAddProductConfirm', 'setOpenAddProductConfirm', false),
    withState('openCheckDeliveryConfirm', 'setOpenCheckDeliveryConfirm', false),
    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            client: null,
            deadlineFromDate: null,
            deadlineToDate: null,
            deliveryFromDate: null,
            deliveryToDate: null,
            deliveryMan: null,
            dept: null,
            division: null,
            exclude: null,
            fromDate: null,
            toDate: null,
            initiator: null,
            onlyBonus: null,
            openCreateDialog: null,
            openFilterDialog: null,
            product: null,
            shop: null,
            zone: null
        }
        const productType = _.get(props, ['addProductsForm', 'values', 'type', 'value'])
        const productTypeNext = _.get(nextProps, ['addProductsForm', 'values', 'type', 'value'])
        return ((props.filterProducts.filterRequest(except) !== nextProps.filterProducts.filterRequest(except)) ||
                (productType !== productTypeNext && nextProps.openAddProductDialog)) && !(props.openAddProductDialog !== nextProps.openAddProductDialog && nextProps.openAddProductDialog)
    },
        ({setOpenAddProductConfirm, addProductsForm, openAddProductDialog, dispatch, filterProducts, createForm}) => {
            const products = _.filter(_.get(addProductsForm, ['values', 'product']), (item) => {
                const amount = _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
                return amount > ZERO
            })
            const priceList = _.get(createForm, ['values', 'priceList', 'value'])
            const currency = _.get(createForm, ['values', 'currency', 'value'])
            const productType = _.get(addProductsForm, ['values', 'type', 'value'])
            const user = _.get(addProductsForm, ['values', 'user', 'value'])
            if (!_.isEmpty(products)) {
                setOpenAddProductConfirm(true)
            } else if (priceList && openAddProductDialog && _.isEmpty(products)) {
                setOpenAddProductConfirm(false)
                dispatch(orderAddProductsListAction(priceList, filterProducts, productType, currency, user))
            }
        }),

    withPropsOnChange((props, nextProps) => {
        return props.openAddProductDialog !== nextProps.openAddProductDialog && nextProps.openAddProductDialog
    }, ({dispatch, createForm, openAddProductDialog, filterProducts, setOpenAddProductConfirm}) => {
        const priceList = _.get(createForm, ['values', 'priceList', 'value'])
        const currency = _.get(createForm, ['values', 'currency', 'value'])
        const user = _.get(createForm, ['values', 'user', 'value'])
        if (openAddProductDialog) {
            setOpenAddProductConfirm(false)
            dispatch(orderAddProductsListAction(priceList, filterProducts, null, currency, user))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.editProductsLoading !== nextProps.editProductsLoading && nextProps.editProductsLoading === false
    }, ({dispatch, createForm, openAddProductDialog, editProducts}) => {
        if (openAddProductDialog) {
            const FLOOR = 2
            const paymentType = _.get(createForm, ['values', 'paymentType'])
            _.map(_.get(editProducts, 'results'), (item) => {
                const id = _.get(item, 'id')
                const price = paymentType === 'cash'
                    ? numberFormat(_.floor(_.toNumber(_.get(item, 'cashPrice')), FLOOR))
                    : paymentType === 'bank'
                        ? numberFormat(_.floor(_.toNumber(_.get(item, 'transferPrice')), FLOOR))
                        : ''
                dispatch(change('OrderAddProductsForm', 'product[' + id + ']', {price: price}))
            })
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openPrint', 'setOpenPrint', false),
    withState('openSalesPrint', 'setOpenSalesPrint', false),
    withState('openContractPrint', 'setOpenContractPrint', false),

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
        handleOpenSalesPrintDialog: props => () => {
            const {setOpenSalesPrint, dispatch, location: {query}} = props
            const orders = _.get(query, 'select')
            setOpenSalesPrint(true)
            dispatch(orderSalesPrintFetchAction(orders))
                .then(() => {
                    window.print()
                })
        },

        handleCloseSalesPrintDialog: props => () => {
            const {setOpenSalesPrint} = props
            setOpenSalesPrint(false)
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
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
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
            const client = _.get(filterForm, ['values', 'client']) || null
            const status = _.get(filterForm, ['values', 'status']) || null
            const product = _.get(filterForm, ['values', 'product']) || null
            const shop = _.get(filterForm, ['values', 'shop']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const zone = _.get(filterForm, ['values', 'zone']) || null
            const dept = _.get(filterForm, ['values', 'dept', 'value']) || null
            const initiator = _.get(filterForm, ['values', 'initiator']) || null
            const deliveryMan = _.get(filterForm, ['values', 'deliveryMan']) || null
            const onlyBonus = _.get(filterForm, ['values', 'onlyBonus']) || null
            const exclude = _.get(filterForm, ['values', 'exclude']) || null

            filter.filterBy({
                [ORDER_FILTER_OPEN]: false,
                [ORDER_FILTER_KEY.CLIENT]: _.join(client, '-'),
                [ORDER_FILTER_KEY.STATUS]: _.join(status, '-'),
                [ORDER_FILTER_KEY.PRODUCT]: _.join(product, '-'),
                [ORDER_FILTER_KEY.INITIATOR]: _.join(initiator, '-'),
                [ORDER_FILTER_KEY.ZONE]: _.join(zone, '-'),
                [ORDER_FILTER_KEY.SHOP]: _.join(shop, '-'),
                [ORDER_FILTER_KEY.DIVISION]: _.join(division, '-'),
                [ORDER_FILTER_KEY.DEPT]: dept,
                [ORDER_FILTER_KEY.ONLY_BONUS]: onlyBonus,
                [ORDER_FILTER_KEY.EXCLUDE]: exclude,
                [ORDER_FILTER_KEY.DELIVERY_MAN]: _.join(deliveryMan, '-'),
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
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname,
                        query: filter.getParams({
                            [ORDER_CREATE_DIALOG_OPEN]: false,
                            [ORDER_SHORTAGE_DIALOG_OPEN]: false
                        })})
                    dispatch(orderListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
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
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_RETURN_DIALOG_OPEN]: false})})
                    dispatch(orderItemReturnFetchAction(orderId))
                    dispatch(orderItemFetchAction(orderId))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
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
                    return dispatch(openSnackbarAction({message: t('Успешно отменена')}))
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
        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, list} = props
            const orderId = _.toInteger(_.get(props, ['params', 'orderId']))

            return dispatch(orderUpdateAction(orderId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(orderItemFetchAction(orderId)).then((data) => {
                        const detail = _.get(data, 'value')
                        dispatch(updateStore(orderId, list, actionTypes.ORDER_LIST, {
                            client: _.get(detail, 'client'),
                            market: {name: _.get(detail, ['market', 'name']), id: _.get(detail, ['market', 'id'])},
                            user: _.get(detail, 'user'),
                            status: _.get(detail, 'status'),
                            currency: _.get(detail, 'currency'),
                            totalPrice: _.get(detail, 'total_price'),
                            totalBalance: _.get(detail, 'total_balance'),
                            dateDelivery: _.get(detail, 'date_delivery'),
                            paymentDate: _.get(detail, 'payment_date')
                        }))
                    })
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname,
                        query: filter.getParams({
                            [ORDER_UPDATE_DIALOG_OPEN]: false,
                            [ORDER_SHORTAGE_DIALOG_OPEN]: false
                        })})
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenMultiUpdate: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_MULTI_EDIT_OPEN]: true})})
        },

        handleCloseMultiUpdate: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_MULTI_EDIT_OPEN]: false})})
        },

        handleSubmitMultiUpdate: props => () => {
            const {dispatch, multiUpdateForm, filter, location: {pathname, query}} = props
            const orders = _.get(query, 'select')

            return dispatch(orderMultiUpdateAction(_.get(multiUpdateForm, 'values'), orders))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Выбранные заказы успешно изменены')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_MULTI_EDIT_OPEN]: false})})
                    dispatch(orderListFetchAction(filter))
                }).catch((error) => {
                    dispatch(openErrorAction({message: error}))
                })
        },

        handleCloseAddProductConfirm: props => () => {
            const {dispatch, createForm, addProductsForm, filterProducts, setOpenAddProductConfirm} = props
            const priceList = _.get(createForm, ['values', 'priceList', 'value'])
            const productType = _.get(addProductsForm, ['values', 'type', 'value'])
            const currency = _.get(addProductsForm, ['values', 'currency', 'value'])
            const user = _.get(addProductsForm, ['values', 'user', 'value'])
            dispatch(orderAddProductsListAction(priceList, filterProducts, productType, currency, user))
            setOpenAddProductConfirm(false)
        },

        handleSubmitAddProductConfirm: props => () => {
            const {addProductsForm, editProducts, dispatch, createForm, filterProducts, setOpenAddProductConfirm} = props
            const priceList = _.get(createForm, ['values', 'priceList', 'value'])
            const currency = _.get(createForm, ['values', 'currency', 'value'])
            const user = _.get(createForm, ['values', 'user', 'value'])
            const productType = _.get(addProductsForm, ['values', 'type', 'value'])
            const existingProducts = _.get(createForm, ['values', 'products']) || []
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(editProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const price = _.get(item, 'price')
                if (amount) {
                    newProductsArray.push({
                        amount: numberWithoutSpaces(amount),
                        cost: numberWithoutSpaces(price),
                        customPrice: _.get(product, 'customPrice'),
                        price: _.get(item, 'price'),
                        product: {
                            id: id,
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'name'),
                                balance: _.get(product, 'balance'),
                                measurement: {
                                    id: _.get(product, ['measurement', 'id']),
                                    name: _.get(product, ['measurement', 'name'])
                                }
                            },
                            text: _.get(product, 'name')
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            dispatch(change('OrderCreateForm', 'products', _.concat(newProductsArray, checkDifference)))
            dispatch(orderAddProductsListAction(priceList, filterProducts, productType, currency, user))
            setOpenAddProductConfirm(false)
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
                    return dispatch(openSnackbarAction({message: t('Скидка добавлена')}))
                })
                .then(() => {
                    return dispatch(orderItemFetchAction(id))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitSetZeroDiscountDialog: props => (id) => {
            const {dispatch} = props
            return dispatch(orderSetDiscountAction(id, ZERO))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Скидка отменена')}))
                })
                .then(() => {
                    return dispatch(orderItemFetchAction(id))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleOpenReleaseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_RELEASE_DIALOG_OPEN]: true})})
        },

        handleCloseReleaseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_RELEASE_DIALOG_OPEN]: false})})
        },
        handleSubmitReleaseDialog: props => () => {
            const {dispatch, releaseForm, filter, location: {pathname, query}} = props
            const orders = _.get(query, 'select')
            const date = moment(_.get(releaseForm, ['values', 'deliveryDate'])).format('YYYY-MM-DD')
            const deliveryMan = _.get(releaseForm, ['values', 'deliveryMan'])
            const pathnameWindow = _.trimStart(ROUTER.STOCK_TRANSFER_LIST_URL, '/')
            const encodeQueryData = (data) => {
                const ret = []
                _.map(data, (item, index) => {
                    ret.push(encodeURIComponent(index) + '=' + encodeURIComponent(item))
                })
                return ret.join('&')
            }
            const queryWindow = encodeQueryData({
                'beginDate': date,
                'endDate': date,
                'deliveryMan': deliveryMan.value,
                'ids': orders,
                'toggle': 'delivery'
            })
            return dispatch(orderMultiUpdateAction(_.get(releaseForm, 'values'), orders, true))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Выбранные заказы успешно сформированы')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_RELEASE_DIALOG_OPEN]: false})})
                    dispatch(orderListFetchAction(filter))
                })
                .then(() => {
                    window.open('/#/' + pathnameWindow + '?' + queryWindow)
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPageSize': 25})})
            setOpenAddProductDialog(true)
        },

        handleCloseAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleSubmitAddProduct: props => () => {
            const {setOpenAddProductDialog, addProductsForm, editProducts, dispatch, createForm, filter, location: {pathname}} = props
            const existingProducts = _.get(createForm, ['values', 'products']) || []
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(editProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const price = _.get(item, 'price')
                if (amount) {
                    newProductsArray.push({
                        amount: numberWithoutSpaces(amount),
                        cost: numberWithoutSpaces(price),
                        customPrice: _.get(product, 'customPrice'),
                        price: {
                            cashPrice: _.get(product, 'cashPrice'),
                            transferPrice: _.get(product, 'transferPrice')
                        },
                        product: {
                            id: id,
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'name'),
                                balance: _.get(product, 'balance'),
                                measurement: {
                                    id: _.get(product, ['measurement', 'id']),
                                    name: _.get(product, ['measurement', 'name'])
                                }
                            },
                            text: _.get(product, 'name')
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            dispatch(change('OrderCreateForm', 'products', _.concat(_.filter(newProductsArray, (item) => item.product.value.id), checkDifference)))
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleGetExcelDocument: props => () => {
            const {filter} = props
            const print = true
            const params = serializers.listFilterSerializer(filter.getParams(), null, null, print)
            getDocuments(API.ORDER_EXCEL, params)
        },
        handleOpenContractPrint: props => () => {
            const {setOpenContractPrint, dispatch, detail} = props
            setOpenContractPrint(true)
            const id = _.get(detail, ['market', 'id'])
            return dispatch(shopItemFetchAction(id))
                .then(() => {
                    setTimeout(() => {
                        window.print()
                    }, HUNDRED)
                })
        },
        handleCloseContractPrint: props => () => {
            const {setOpenContractPrint} = props
            setOpenContractPrint(false)
        },

        handleOpenCheckDeliveryDialog: props => () => {
            const {setOpenCheckDeliveryConfirm} = props
            setOpenCheckDeliveryConfirm(true)
        },

        handleCloseCheckDeliveryDialog: props => () => {
            const {setOpenCheckDeliveryConfirm} = props
            setOpenCheckDeliveryConfirm(false)
        },

        handleSubmitCheckDeliveryDialog: props => () => {
            const {dispatch, setOpenCheckDeliveryConfirm, params, list} = props
            const orderID = _.toInteger(_.get(params, 'orderId'))
            return dispatch(orderCheckDeliveryAction(orderID))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Заказ отмечен как "доставлен"')}))
                })
                .then(() => {
                    setOpenCheckDeliveryConfirm(false)
                    return dispatch(orderItemFetchAction(orderID))
                })
                .then((data) => {
                    const detail = _.get(data, 'value')
                    dispatch(updateStore(orderID, list, actionTypes.ORDER_LIST, {
                        status: _.get(detail, 'status')
                    }))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
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
        filter,
        layout,
        products,
        openPrint,
        paymentLoading,
        params,
        listPrint,
        listPrintLoading,
        defaultUser,
        isSuperUser,
        editProducts,
        editProductsLoading,
        orderCounts,
        orderCountsLoading,
        openAddProductDialog,
        openAddProductConfirm,
        filterProducts,
        openSalesPrint,
        salesPrintData,
        salesPrintDataLoading,
        openContractPrint,
        marketDetailsLoading,
        marketDetails,
        openCheckDeliveryConfirm
    } = props
    const openFilterDialog = toBoolean(_.get(location, ['query', ORDER_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', ORDER_CREATE_DIALOG_OPEN]))
    const openTransactionsDialog = toBoolean(_.get(location, ['query', ORDER_TRANSACTIONS_DIALOG_OPEN]))
    const openReturnDialog = toBoolean(_.get(location, ['query', ORDER_RETURN_DIALOG_OPEN]))
    const openShortageDialog = toBoolean(_.get(location, ['query', ORDER_SHORTAGE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
    const openMultiUpdateDialog = toBoolean(_.get(location, ['query', ORDER_MULTI_EDIT_OPEN]))
    const openCancelOrderReturnDialog = _.toInteger(_.get(location, ['query', CANCEL_ORDER_RETURN_DIALOG_OPEN]))
    const openReleaseDialog = toBoolean(_.get(location, ['query', ORDER_RELEASE_DIALOG_OPEN]))

    const client = filter.getParam(ORDER_FILTER_KEY.CLIENT)
    const dept = _.toInteger(filter.getParam(ORDER_FILTER_KEY.DEPT))
    const initiator = filter.getParam(ORDER_FILTER_KEY.INITIATOR)
    const zone = filter.getParam(ORDER_FILTER_KEY.ZONE)
    const deliveryMan = filter.getParam(ORDER_FILTER_KEY.DELIVERY_MAN)
    const orderStatus = filter.getParam(ORDER_FILTER_KEY.STATUS)
    const shop = filter.getParam(ORDER_FILTER_KEY.SHOP)
    const product = filter.getParam(ORDER_FILTER_KEY.PRODUCT)
    const division = filter.getParam(ORDER_FILTER_KEY.DIVISION)
    const status = filter.getParam(ORDER_FILTER_KEY.STATUS)
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
    const orders = _.get(location, ['query', 'select'])

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
        handleSubmitShortageDialog: openCreateDialog ? props.handleSubmitCreateDialog : props.handleSubmitUpdateDialog
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
        const foundProduct = _.find(_.get(editProducts, 'results'), {'id': id})
        return _.toInteger(_.get(foundProduct, 'balance'))
    }
    const getPrice = (id) => {
        const foundProduct = _.find(_.get(editProducts, 'results'), {'id': id})
        return {
            cashPrice: _.get(foundProduct, 'cashPrice'),
            transferPrice: _.get(foundProduct, 'transferPrice')
        }
    }
    const groupById = _.groupBy(withoutBonusProducts, item => _.get(item, ['product', 'id']))
    const groupedProducts = _.map(groupById, (item) => {
        return {
            amount: _.sumBy(item, obj => _.toNumber(_.get(obj, 'amount'))),
            cost: _.get(_.first(item), 'price'),
            customPrice: _.get(_.first(item), ['product', 'customPrice']),
            price: getPrice(_.get(_.first(item), ['product', 'id'])),
            product: {
                id: _.get(_.first(item), 'id'),
                value: {
                    id: _.get(_.first(item), ['product', 'id']),
                    name: _.get(_.first(item), ['product', 'name']),
                    balance: getBalance(_.get(_.first(item), ['product', 'id'])),
                    measurement: {
                        id: _.get(_.first(item), ['product', 'measurement', 'id']),
                        name: _.get(_.first(item), ['product', 'measurement', 'name'])
                    }
                }
            }
        }
    })
    const updateDialog = {
        initialValues: (() => {
            if (openCreateDialog || !detail) {
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
            const deliveryType = _.get(detail, ['deliveryType'])
            let deliveryTypeText = 'Доставка'
            if (deliveryType === 'self') {
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
                contract: _.get(detail, 'contract'),
                currency: {
                    value: _.get(detail, ['currency', 'id']),
                    text: _.get(detail, ['currency', 'name'])
                },
                market: {
                    value: _.toInteger(_.get(detail, ['market', 'id']))
                },
                deliveryMan: {
                    value: _.get(detail, ['deliveryMan', 'id'] || ZERO)
                },
                deliveryType: {
                    value: deliveryType,
                    text: deliveryTypeText
                },
                isConfirmed: _.toNumber(_.get(detail, 'status')) !== ORDER_NOT_CONFIRMED,
                dealType: dealType || '',
                paymentType: paymentType || '',
                deliveryDate: _.get(detail, ['dateDelivery']) ? moment(_.get(detail, ['dateDelivery'])).toDate() : '',
                requestDeadline: _.get(detail, ['requestDeadline']) && moment(_.get(detail, ['requestDeadline'])).toDate(),
                deliveryPrice: numberFormat(_.get(detail, 'deliveryPrice')),
                discountPrice: discount,
                paymentDate: moment(_.get(detail, ['paymentDate'])).toDate(),
                nextPaymentDate: moment(_.get(detail, ['nextPaymentDate'])).toDate(),
                products: groupedProducts,
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

    const givenOrDelivery = _.includes(_
        .chain(orders)
        .split('-')
        .map((item) => {
            const statusItem = _.toInteger(_.get(_.find(_.get(list, 'results'), {'id': _.toInteger(item)}), 'status'))
            return (statusItem === ORDER_GIVEN || statusItem === ORDER_DELIVERED)
        })
        .value(), true)
    const cancelled = _.includes(_
        .chain(orders)
        .split('-')
        .map((item) => {
            const statusItem = _.toInteger(_.get(_.find(_.get(list, 'results'), {'id': _.toInteger(item)}), 'status'))
            return statusItem === ORDER_CANCELED
        })
        .value(), true)

    const multiUpdateDialog = {
        givenOrDelivery,
        cancelled,
        openMultiUpdateDialog,
        handleOpenMultiUpdate: props.handleOpenMultiUpdate,
        handleCloseMultiUpdate: props.handleCloseMultiUpdate,
        handleSubmitMultiUpdate: props.handleSubmitMultiUpdate
    }

    const filterDialog = {
        initialValues: {
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            orderStatus: orderStatus && _.map(_.split(orderStatus, '-'), (item) => {
                return _.toNumber(item)
            }),
            division: division && _.map(_.split(division, '-'), (item) => {
                return _.toNumber(item)
            }),
            status: status && _.map(_.split(status, '-'), (item) => {
                return _.toNumber(item)
            }),
            shop: shop && _.map(_.split(shop, '-'), (item) => {
                return _.toNumber(item)
            }),
            product: product && _.map(_.split(product, '-'), (item) => {
                return _.toNumber(item)
            }),
            initiator: initiator && _.map(_.split(initiator, '-'), (item) => {
                return _.toNumber(item)
            }),
            dept: {
                value: dept
            },
            zone: zone && _.map(_.split(zone, '-'), (item) => {
                return _.toNumber(item)
            }),
            deliveryMan: deliveryMan && _.map(_.split(deliveryMan, '-'), (item) => {
                return _.toNumber(item)
            }),
            deliveryDate: {
                fromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                toDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
            },
            deadlineDate: {
                fromDate: deadlineFromDate && moment(deadlineFromDate, 'YYYY-MM-DD'),
                toDate: deadlineToDate && moment(deadlineToDate, 'YYYY-MM-DD')
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
        listLoading,
        orderCounts,
        orderCountsLoading
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
    const printSalesDialog = {
        openSalesPrint,
        handleOpenSalesPrintDialog: props.handleOpenSalesPrintDialog,
        handleCloseSalesPrintDialog: props.handleCloseSalesPrintDialog
    }
    const printContractDialog = {
        openContractPrint,
        handleOpenContractPrint: props.handleOpenContractPrint,
        handleCloseContractPrint: props.handleCloseContractPrint
    }

    const addProductDialog = {
        openAddProductDialog,
        filter: filterProducts,
        data: _.get(editProducts, 'results'),
        loading: editProductsLoading,
        handleOpenAddProduct: props.handleOpenAddProduct,
        handleCloseAddProduct: props.handleCloseAddProduct,
        handleSubmitAddProduct: props.handleSubmitAddProduct,
        openAddProductConfirm,
        handleCloseAddProductConfirm: props.handleCloseAddProductConfirm,
        handleSubmitAddProductConfirm: props.handleSubmitAddProductConfirm
    }

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={listPrintData}/>
    }

    if (openSalesPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderSalesPrint
            onClose={printSalesDialog.handleCloseSalesPrintDialog}
            loading={salesPrintDataLoading}
            data={salesPrintData}/>
    }
    if (openContractPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderContractPrint
            onClose={printContractDialog.handleCloseContractPrint}
            loading={marketDetailsLoading}
            marketData={marketDetails}
            data={{
                client: _.get(detail, 'client'),
                currency: _.get(detail, 'currency'),
                market: _.get(detail, 'market'),
                products: _.get(detail, 'products'),
                id: _.get(detail, 'id')
            }}/>
    }

    const canChangeAnyPrice = checkPermission('can_set_any_price')
    const canChangePrice = checkPermission('can_change_price')

    const releaseDialog = {
        openReleaseDialog,
        givenOrDelivery,
        handleOpenReleaseDialog: props.handleOpenReleaseDialog,
        handleCloseReleaseDialog: props.handleCloseReleaseDialog,
        handleSubmitReleaseDialog: props.handleSubmitReleaseDialog
    }

    const checkDeliveryDialog = {
        open: openCheckDeliveryConfirm,
        handleOpen: props.handleOpenCheckDeliveryDialog,
        handleClose: props.handleCloseCheckDeliveryDialog,
        handleSubmit: props.handleSubmitCheckDeliveryDialog
    }

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
                getExcelDocument={props.handleGetExcelDocument}
                createClientDialog={createClientDialog}
                transactionsDialog={transactionsDialog}
                returnDialog={returnDialog}
                shortageDialog={shortageDialog}
                confirmDialog={confirmDialog}
                returnDataLoading={returnDataLoading}
                updateDialog={updateDialog}
                multiUpdateDialog={multiUpdateDialog}
                filterDialog={filterDialog}
                products={products}
                printDialog={printDialog}
                type={order}
                refreshAction={props.handleRefreshList}
                cancelOrderReturnDialog={cancelOrderReturnDialog}
                canChangeAnyPrice={canChangeAnyPrice}
                canChangePrice={canChangePrice}
                handleSubmitDiscountDialog={props.handleSubmitDiscountDialog}
                handleSubmitSetZeroDiscountDialog={props.handleSubmitSetZeroDiscountDialog}
                isSuperUser={isSuperUser}
                releaseDialog={releaseDialog}
                addProductDialog={addProductDialog}
                printSalesDialog={printSalesDialog}
                printContractDialog={printContractDialog}
                scrollValue={_.get(layout, 'scrollValue')}
                checkDeliveryDialog={checkDeliveryDialog}
            />
        </Layout>
    )
})

export default OrderList
