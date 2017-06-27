import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import * as ORDER_TAB from '../../constants/orderTab'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
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
    OrderGridList
} from '../../components/Order'
const CLIENT_CREATE_DIALOG_OPEN = 'openClientCreate'
import {
    orderCreateAction,
    orderUpdateAction,
    orderListFetchAction,
    orderCSVFetchAction,
    orderDeleteAction,
    orderItemFetchAction,
    orderReturnAction,
    orderReturnListAction,
    orderTransactionFetchAction,
    orderItemReturnFetchAction,
    getDocumentAction
} from '../../actions/order'
import {
    clientCreateAction
} from '../../actions/client'
import {openSnackbarAction} from '../../actions/snackbar'

const MINUS_ONE = -1
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const payment = _.get(state, ['order', 'payment', 'data'])
        const orderReturnList = _.get(state, ['order', 'returnList', 'data'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const createLoading = _.get(state, ['order', 'create', 'loading'])
        const createClientLoading = _.get(state, ['client', 'create', 'loading'])
        const transactionsLoading = _.get(state, ['order', 'create', 'loading'])
        const returnLoading = _.get(state, ['order', 'return', 'loading'])
        const returnDataLoading = _.get(state, ['order', 'return', 'loading'])
        const returnDialogLoading = _.get(state, ['order', 'returnList', 'loading'])
        const shortageLoading = _.get(state, ['order', 'create', 'loading'])
        const updateLoading = _.get(state, ['order', 'update', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const csvData = _.get(state, ['order', 'csv', 'data'])
        const csvLoading = _.get(state, ['order', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'OrderFilterForm'])
        const createForm = _.get(state, ['form', 'OrderCreateForm'])
        const clientCreateForm = _.get(state, ['form', 'ClientCreateForm'])
        const returnForm = _.get(state, ['form', 'OrderReturnForm'])
        const returnData = _.get(state, ['order', 'return', 'data', 'results'])
        const products = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            payment,
            detailLoading,
            createLoading,
            createClientLoading,
            transactionsLoading,
            returnLoading,
            shortageLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterForm,
            createForm,
            clientCreateForm,
            returnForm,
            returnData,
            orderReturnList,
            returnDataLoading,
            returnDialogLoading,
            products
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevTransaction = _.get(props, ['location', 'query', 'openTransactionsDialog'])
        const nextTransaction = _.get(nextProps, ['location', 'query', 'openTransactionsDialog'])
        return prevTransaction !== nextTransaction && nextTransaction === 'true'
    }, ({dispatch, params}) => {
        const orderId = _.toInteger(_.get(params, 'orderId'))
        if (orderId > ZERO) {
            dispatch(orderTransactionFetchAction(orderId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab'])
        const nextTab = _.get(nextProps, ['location', 'query', 'tab'])
        return prevTab !== nextTab && nextTab === 'return'
    }, ({dispatch, params}) => {
        const orderId = _.toInteger(_.get(params, 'orderId'))
        if (orderId > ZERO) {
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

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        },
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(orderCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
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
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(orderListFetchAction(filter))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
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
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const dostDate = _.get(filterForm, ['values', 'dostDate', 'date']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const orderStatus = _.get(filterForm, ['values', 'orderStatus', 'value']) || null

            filter.filterBy({
                [ORDER_FILTER_OPEN]: false,
                [ORDER_FILTER_KEY.CLIENT]: client,
                [ORDER_FILTER_KEY.ORDERSTATUS]: orderStatus,
                [ORDER_FILTER_KEY.DOSTDATE]: dostDate && dostDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [ORDER_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },
        handleOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_CREATE_DIALOG_OPEN]: true})})
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
            const {dispatch, returnForm, detail, filter, location: {pathname}} = props
            return dispatch(orderReturnAction(_.get(returnForm, ['values']), detail))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_RETURN_DIALOG_OPEN]: false})})
                    dispatch(orderItemReturnFetchAction(filter))
                    dispatch(orderItemFetchAction(filter))
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
                    hashHistory.push({pathname, query: filter.getParams({[ORDER_SHORTAGE_DIALOG_OPEN]: false, [ORDER_CREATE_DIALOG_OPEN]: false})})
                    dispatch(orderListFetchAction(filter))
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
                })
        },

        handleOpenCreateClientDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateClientDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateClientDialog: props => () => {
            const {dispatch, clientCreateForm, filter} = props

            return dispatch(clientCreateAction(_.get(clientCreateForm, ['values'])))
                .then((data) => {
                    const value = _.get(data, ['value', 'id'])
                    dispatch({
                        type: '@@redux-form/CHANGE',
                        payload: {text: '', value: value},
                        meta: {
                            field: 'client',
                            touch: false,
                            form: 'OrderCreateForm',
                            persistentSubmitErrors: false
                        }
                    })
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CLIENT_CREATE_DIALOG_OPEN]: false}))
                })
        },

        handleGetDocument: props => (id) => {
            const {dispatch} = props
            return dispatch(getDocumentAction(id))
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.ORDER_LIST_URL, query: filter.getParam()})
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
        createClientLoading,
        transactionsLoading,
        returnLoading,
        shortageLoading,
        updateLoading,
        returnDataLoading,
        returnDialogLoading,
        filter,
        layout,
        products,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', ORDER_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', ORDER_CREATE_DIALOG_OPEN]))
    const openTransactionsDialog = toBoolean(_.get(location, ['query', ORDER_TRANSACTIONS_DIALOG_OPEN]))
    const openOrderItemReturnDialog = _.toInteger(_.get(location, ['query', 'openOrderItemReturnDialog']) || MINUS_ONE) > MINUS_ONE
    const openReturnDialog = toBoolean(_.get(location, ['query', ORDER_RETURN_DIALOG_OPEN]))
    const openShortageDialog = toBoolean(_.get(location, ['query', ORDER_SHORTAGE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', ORDER_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))

    const client = _.toInteger(filter.getParam(ORDER_FILTER_KEY.CLIENT))
    const orderStatus = _.toInteger(filter.getParam(ORDER_FILTER_KEY.ORDERSTATUS))
    const dostDate = filter.getParam(ORDER_FILTER_KEY.DOSTDATE)
    const fromDate = filter.getParam(ORDER_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(ORDER_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'orderId'))
    const tab = _.get(location, ['query', TAB]) || ORDER_TAB.ORDER_DEFAULT_TAB

    const openCreateClientDialog = toBoolean(_.get(location, ['query', CLIENT_CREATE_DIALOG_OPEN]))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const transactionsDialog = {
        transactionsLoading,
        openTransactionsDialog,
        handleOpenTransactionsDialog: props.handleOpenTransactionsDialog,
        handleCloseTransactionsDialog: props.handleCloseTransactionsDialog
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

    const deleteDialog = {
        openDeleteDialog,
        handleOpenDeleteDialog: props.handleOpenDeleteDialog,
        handleCloseDeleteDialog: props.handleCloseDeleteDialog
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
        initialValues: (() => {
            return {
                contacts: [{}]
            }
        })(),
        createClientLoading,
        openCreateClientDialog,
        handleOpenCreateClientDialog: props.handleOpenCreateClientDialog,
        handleCloseCreateClientDialog: props.handleCloseCreateClientDialog,
        handleSubmitCreateClientDialog: props.handleSubmitCreateClientDialog
    }
    const forUpdateProducts = _.map(_.get(detail, 'products'), (item) => {
        return {
            amount: _.get(item, 'amount'),
            cost: _.get(item, 'price'),
            measurement: _.get(item, ['product', 'measurement', 'name']),
            product: {
                value: _.get(item, ['product', 'id']),
                text: _.get(item, ['product', 'name'])
            }

        }
    })

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }
            const HUND = 100
            const discountPrice = _.toNumber(_.get(detail, 'discountPrice'))
            const totalPrice = _.toNumber(_.get(detail, 'totalPrice'))
            const discount = (discountPrice / (discountPrice + totalPrice)) * HUND
            return {
                client: {
                    value: _.get(detail, ['client', 'id'])
                },
                contact: {
                    value: _.get(detail, ['contact', 'id'])
                },
                deliveryType: _.get(detail, ['deliveryType', 'id']),
                deliveryDate: moment(_.get(detail, ['dateDelivery'])).toDate(),
                deliveryPrice: _.get(detail, 'deliveryPrice'),
                discountPrice: discount,
                paymentDate: moment(_.get(detail, ['paymentDate'])).toDate(),
                products: forUpdateProducts
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
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
            dostDate: {
                dostDate: dostDate && moment(dostDate, 'YYYY-MM-DD')
            },
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

    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const detailData = {
        id: detailId,
        data: detail,
        return: returnData,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const paymentData = {
        id: detailId,
        data: payment,
        transactionsLoading
    }

    return (
        <Layout {...layout}>
            <OrderGridList
                filter={filter}
                listData={listData}
                tabData={tabData}
                detailData={detailData}
                returnListData={orderReturnList}
                paymentData={paymentData}
                createDialog={createDialog}
                getDocument={getDocument}
                createClientDialog={createClientDialog}
                transactionsDialog={transactionsDialog}
                itemReturnDialog={itemReturnDialog}
                returnDialog={returnDialog}
                shortageDialog={shortageDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                returnDataLoading={returnDataLoading}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
                products={products}
            />
        </Layout>
    )
})

export default OrderList
