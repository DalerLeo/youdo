import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {openErrorAction} from '../../actions/error'
import updateStore from '../../helpers/updateStore'
import * as actionTypes from '../../constants/actionTypes'
import checkPermission from '../../helpers/checkPermission'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'
import {
    RETURN_FILTER_KEY,
    RETURN_FILTER_OPEN,
    RETURN_CREATE_DIALOG_OPEN,
    CANCEL_RETURN_DIALOG_OPEN,
    RETURN_UPDATE_DIALOG_OPEN,
    ReturnGridList,
    ReturnPrint
} from '../../components/Return'
import {
    returnListFetchAction,
    returnItemFetchAction,
    returnListPrintFetchAction,
    returnCancelAction,
    returnUpdateAction,
    clientReturnUpdateAction,
    clientReturnAction
} from '../../actions/return'
import {orderItemFetchAction} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'

const TWO = 2

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['return', 'item', 'data'])
        const detailLoading = _.get(state, ['return', 'item', 'loading'])
        const updateLoading = _.get(state, ['return', 'update', 'loading'])
        const list = _.get(state, ['return', 'list', 'data'])
        const listInfo = _.get(state, ['return', 'list'])
        const listPrint = _.get(state, ['return', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['return', 'listPrint', 'loading'])
        const listLoading = _.get(state, ['return', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ReturnFilterForm'])
        const createForm = _.get(state, ['form', 'ReturnCreateForm'])
        const filter = filterHelper(list, pathname, query)
        const updateForm = _.get(state, ['form', 'OrderReturnForm'])
        const updateClientForm = _.get(state, ['form', 'ReturnCreateForm'])
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const hasMarket = toBoolean(getConfig('MARKETS_MODULE'))
        return {
            list,
            listLoading,
            detail,
            listPrintLoading,
            listPrint,
            detailLoading,
            updateLoading,
            filter,
            filterForm,
            updateForm,
            updateClientForm,
            isAdmin,
            createForm,
            listInfo,
            hasMarket
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            showCheckboxes: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(returnListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const returnId = _.get(nextProps, ['params', 'returnId'])
        return returnId && _.get(props, ['params', 'returnId']) !== returnId
    }, ({dispatch, params}) => {
        const returnId = _.toInteger(_.get(params, 'returnId'))
        returnId && dispatch(returnItemFetchAction(returnId))
    }),
    withPropsOnChange((props, nextProps) => {
        const loading = _.get(props, 'detailLoading')
        const nextLoading = _.get(nextProps, 'detailLoading')
        return loading !== nextLoading && nextLoading === false
    }, ({dispatch, detail}) => {
        const orderID = _.toInteger(_.get(detail, 'order'))
        orderID && dispatch(orderItemFetchAction(orderID))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openPrint', 'setOpenPrint', false),
    withHandlers({
        handleOpenPrintDialog: props => () => {
            const {dispatch, setOpenPrint, filter} = props
            setOpenPrint(true)
            return dispatch(returnListPrintFetchAction(null, filter))
                .then(() => {
                    window.print()
                })
        },

        handleClosePrintDialog: props => () => {
            const {setOpenPrint} = props
            setOpenPrint(false)
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
            const id = _.get(detail, 'id')
            dispatch(returnCancelAction(id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(returnItemFetchAction(id))
                    dispatch(returnListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: {}})
            dispatch(reset('ReturnCreateForm'))
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'data', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'data', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const order = _.get(filterForm, ['values', 'order']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const status = _.get(filterForm, ['values', 'status']) || null
            const market = _.get(filterForm, ['values', 'market']) || null
            const initiator = _.get(filterForm, ['values', 'initiator']) || null
            const product = _.get(filterForm, ['values', 'product']) || null
            const division = _.get(filterForm, ['values', 'division']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const code = _.get(filterForm, ['values', 'code']) || null
            const exclude = _.get(filterForm, ['values', 'exclude']) || false

            filter.filterBy({
                [RETURN_FILTER_OPEN]: false,
                [RETURN_FILTER_KEY.TYPE]: type,
                [RETURN_FILTER_KEY.ORDER]: order,
                [RETURN_FILTER_KEY.CLIENT]: _.join(client, '-'),
                [RETURN_FILTER_KEY.STATUS]: _.join(status, '-'),
                [RETURN_FILTER_KEY.INITIATOR]: _.join(initiator, '-'),
                [RETURN_FILTER_KEY.MARKET]: _.join(market, '-'),
                [RETURN_FILTER_KEY.PRODUCT]: _.join(product, '-'),
                [RETURN_FILTER_KEY.DIVISION]: _.join(division, '-'),
                [RETURN_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [RETURN_FILTER_KEY.CODE]: code,
                [RETURN_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.EXCLUDE]: exclude
            })
        },

        handleOpenCancelReturnDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_DIALOG_OPEN]: id})})
        },

        handleCloseCancelReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_DIALOG_OPEN]: false})})
        },
        handleSubmitCancelReturnDialog: props => () => {
            const {dispatch, filter, params, location: {pathname, query}} = props
            const orderReturnId = _.toInteger(_.get(query, CANCEL_RETURN_DIALOG_OPEN))
            const orderId = _.toInteger(_.get(params, 'orderId'))
            return dispatch(returnCancelAction(orderReturnId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно отменена')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_DIALOG_OPEN]: false})})
                    dispatch(returnListFetchAction(filter))
                    dispatch(returnItemFetchAction(orderId))
                })
        },

        handleGetDocument: props => (id) => {
            const {dispatch, setOpenPrint, filter} = props
            setOpenPrint(true)
            return dispatch(returnListPrintFetchAction(id, filter))
                .then(() => {
                    window.print()
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, updateForm, updateClientForm, filter, location: {pathname}, detail, list} = props
            const type = _.toInteger(_.get(detail, 'type'))
            const returnId = _.toInteger(_.get(props, ['params', 'returnId']))
            if (type === TWO) {
                return dispatch(clientReturnUpdateAction(returnId, _.get(updateClientForm, ['values']), detail))
                    .then(() => {
                        return dispatch(returnItemFetchAction(returnId))
                            .then((data) => {
                                const detailData = _.get(data, 'value')
                                return dispatch(updateStore(returnId, list, actionTypes.RETURN_LIST, {
                                    stock: _.get(detailData, 'stock'),
                                    comment: _.get(detailData, 'comment'),
                                    totalPrice: _.get(detailData, 'total_price')
                                }))
                            })
                    })
                    .then(() => {
                        return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                    })
                    .then(() => {
                        hashHistory.push({pathname, query: filter.getParams({[RETURN_UPDATE_DIALOG_OPEN]: false})})
                    }).catch((error) => {
                        dispatch(openErrorAction({
                            message: error
                        }))
                    })
            }
            return dispatch(returnUpdateAction(returnId, _.get(updateForm, ['values']), detail))
                .then(() => {
                    return dispatch(returnItemFetchAction(returnId))
                        .then((data) => {
                            const detailData = _.get(data, 'value')
                            return dispatch(updateStore(returnId, list, actionTypes.RETURN_LIST, {
                                stock: _.get(detailData, 'stock'),
                                comment: _.get(detailData, 'comment'),
                                totalPrice: _.get(detailData, 'total_price')
                            }))
                        })
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[RETURN_UPDATE_DIALOG_OPEN]: false})})
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ReturnCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RETURN_CREATE_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateDialog: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props
            return dispatch(clientReturnAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[RETURN_CREATE_DIALOG_OPEN]: false})
                    })
                    dispatch(returnListFetchAction(filter))
                    dispatch(reset('ReturnCreateForm'))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.RETURN_LIST_URL, query: filter.getParams()})
        }
    }),
)

const ReturnList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        returnData,
        returnReturnList,
        detailLoading,
        updateLoading,
        returnDataLoading,
        filter,
        layout,
        products,
        openPrint,
        params,
        listPrint,
        listPrintLoading,
        isAdmin,
        hasMarket
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', RETURN_FILTER_OPEN]))
    const openCancelDialog = _.toInteger(_.get(location, ['query', CANCEL_RETURN_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', RETURN_UPDATE_DIALOG_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', RETURN_CREATE_DIALOG_OPEN]))

    const client = filter.getParam(RETURN_FILTER_KEY.CLIENT)
    const division = filter.getParam(RETURN_FILTER_KEY.DIVISION)
    const returnStatus = filter.getParam(RETURN_FILTER_KEY.STATUS)
    const initiator = filter.getParam(RETURN_FILTER_KEY.INITIATOR)
    const market = filter.getParam(RETURN_FILTER_KEY.MARKET)
    const product = filter.getParam(RETURN_FILTER_KEY.PRODUCT)
    const paymentType = _.toInteger(filter.getParam(RETURN_FILTER_KEY.PAYMENT_TYPE))
    const fromDate = filter.getParam(RETURN_FILTER_KEY.FROM_DATE)
    const deliveryFromDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_FROM_DATE)
    const toDate = filter.getParam(RETURN_FILTER_KEY.TO_DATE)
    const deliveryToDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_TO_DATE)
    const exclude = _.isUndefined(filter.getParam(RETURN_FILTER_KEY.EXCLUDE)) ? true : filter.getParam(RETURN_FILTER_KEY.EXCLUDE)

    const detailId = _.toInteger(_.get(params, 'returnId'))

    const canChangeAnyReturn = checkPermission('frontend_add_client_return')

    const cancelReturnDialog = {
        openCancelDialog,
        handleOpenCancelReturnDialog: props.handleOpenCancelReturnDialog,
        handleCloseCancelReturnDialog: props.handleCloseCancelReturnDialog,
        handleSubmitCancelReturnDialog: props.handleSubmitCancelReturnDialog
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

    const filterDialog = {
        initialValues: {
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            paymentType: {
                value: paymentType
            },
            status: returnStatus && _.map(_.split(returnStatus, '-'), (item) => {
                return _.toNumber(item)
            }),
            division: division && _.map(_.split(division, '-'), (item) => {
                return _.toNumber(item)
            }),
            product: product && _.map(_.split(product, '-'), (item) => {
                return _.toNumber(item)
            }),
            market: market && _.map(_.split(market, '-'), (item) => {
                return _.toNumber(item)
            }),
            initiator: initiator && _.map(_.split(initiator, '-'), (item) => {
                return _.toNumber(item)
            }),
            deliveryDate: {
                deliveryFromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                deliveryToDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
            },
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            },
            exclude: exclude
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
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        return: returnData,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const CLIENT_RETURN = 2
    const type = _.toInteger(_.get(detail, 'type'))

    const forUpdateProducts = _.map(_.get(detail, 'returnedProducts'), (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const price = _.toNumber(_.get(item, 'price'))
        if (type === CLIENT_RETURN) {
            return {
                id: _.get(item, 'id'),
                amount,
                cost: price,
                measurement: _.get(item, ['product', 'measurement', 'name']),
                product: {
                    value: {
                        id: _.get(item, ['product', 'id']),
                        productId: _.get(item, ['product', 'id']),
                        price: _.get(item, 'price'),
                        name: _.get(item, ['product', 'name']),
                        measurement: {
                            id: _.get(item, ['product', 'measurement', 'id']),
                            name: _.get(item, ['product', 'measurement', 'name'])
                        }
                    }
                }
            }
        }
        return {
            id: _.get(item, 'id'),
            amount,
            product: {
                value: {
                    id: _.get(item, 'orderProduct'),
                    price,
                    product: {
                        name: _.get(item, ['product', 'name']),
                        measurement: {
                            id: _.get(item, ['product', 'measurement', 'id']),
                            name: _.get(item, ['product', 'measurement', 'name'])
                        }
                    }
                },
                text: _.get(item, ['product', 'name'])
            }
        }
    })

    const createDialog = {
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            } else if (type === CLIENT_RETURN) {
                return {
                    client: {value: _.get(detail, ['client', 'id'])},
                    stock: {value: _.get(detail, ['stock', 'id'])},
                    market: {value: _.get(detail, ['market', 'id'])},
                    priceList: {value: _.get(detail, ['priceList', 'id'])},
                    currency: {
                        value: _.get(detail, ['currency', 'id']),
                        text: _.get(detail, ['currency', 'name'])
                    },
                    paymentType: {value: _.get(detail, ['paymentType'])},
                    comment: _.get(detail, 'comment'),
                    products: forUpdateProducts
                }
            }

            return {
                stock: {value: _.get(detail, ['stock', 'id']), text: _.get(detail, ['stock', 'name'])},
                comment: _.get(detail, 'comment'),
                products: forUpdateProducts
            }
        })(),
        updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const printDialog = {
        openPrint,
        handleOpenPrintDialog: props.handleOpenPrintDialog,
        handleClosePrintDialog: props.handleClosePrintDialog
    }

    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <ReturnPrint
            printDialog={printDialog}
            listPrintData={listPrintData}/>
    }

    document.getElementById('wrapper').style.height = '100%'
    return (
        <Layout {...layout}>
            <ReturnGridList
                canChangeAnyReturn={canChangeAnyReturn}
                filter={filter}
                listData={listData}
                detailData={detailData}
                returnListData={returnReturnList}
                getDocument={getDocument}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                returnDataLoading={returnDataLoading}
                filterDialog={filterDialog}
                products={products}
                printDialog={printDialog}
                cancelReturnDialog={cancelReturnDialog}
                isAdmin={isAdmin}
                createDialog={createDialog}
                hasMarket={hasMarket}
            />
        </Layout>
    )
})

export default ReturnList
