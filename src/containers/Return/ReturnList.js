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

import {
    RETURN_FILTER_KEY,
    RETURN_FILTER_OPEN,
    ReturnGridList,
    ReturnPrint
} from '../../components/Return'
const CLIENT_CREATE_DIALOG_OPEN = 'openClientCreate'
const CANCEL_RETURN_RETURN_DIALOG_OPEN = 'openCancelConfirmDialog'
import {
    returnListFetchAction,
    returnDeleteAction,
    returnItemFetchAction,
    returnReturnListAction,
    returnTransactionFetchAction,
    returnItemReturnFetchAction,
    returnListPintFetchAction,
    returnReturnCancelAction
} from '../../actions/return'
import {
    clientCreateAction
} from '../../actions/client'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['return', 'item', 'data'])
        const payment = _.get(state, ['return', 'payment', 'data'])
        const paymentLoading = _.get(state, ['return', 'payment', 'loading'])
        const returnReturnList = _.get(state, ['return', 'returnList', 'data'])
        const detailLoading = _.get(state, ['return', 'item', 'loading'])
        const createLoading = _.get(state, ['return', 'create', 'loading'])
        const createClientLoading = _.get(state, ['client', 'create', 'loading'])
        const returnLoading = _.get(state, ['return', 'return', 'loading'])
        const returnDataLoading = _.get(state, ['return', 'return', 'loading'])
        const returnDialogLoading = _.get(state, ['return', 'returnList', 'loading'])
        const shortageLoading = _.get(state, ['return', 'create', 'loading'])
        const updateLoading = _.get(state, ['return', 'update', 'loading'])
        const list = _.get(state, ['return', 'list', 'data'])
        const listPrint = _.get(state, ['return', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['return', 'listPrint', 'loading'])
        const listLoading = _.get(state, ['return', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ReturnFilterForm'])
        const createForm = _.get(state, ['form', 'ReturnCreateForm'])
        const clientCreateForm = _.get(state, ['form', 'ClientCreateForm'])
        const returnForm = _.get(state, ['form', 'ReturnReturnForm'])
        const returnData = _.get(state, ['return', 'return', 'data', 'results'])
        const products = _.get(state, ['form', 'ReturnCreateForm', 'values', 'products'])
        const editProducts = _.get(state, ['return', 'updateProducts', 'data', 'results'])
        const filter = filterHelper(list, pathname, query)

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
            returnLoading,
            shortageLoading,
            updateLoading,
            filter,
            filterForm,
            paymentLoading,
            createForm,
            clientCreateForm,
            returnForm,
            returnData,
            returnReturnList,
            returnDataLoading,
            returnDialogLoading,
            products,
            editProducts
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(returnListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevTransaction = _.get(props, ['location', 'query', 'openTransactionsDialog'])
        const nextTransaction = _.get(nextProps, ['location', 'query', 'openTransactionsDialog'])
        return prevTransaction !== nextTransaction && nextTransaction === 'true'
    }, ({dispatch, params}) => {
        const returnId = _.toInteger(_.get(params, 'returnId'))
        if (returnId > ZERO) {
            dispatch(returnTransactionFetchAction(returnId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevReturnId = _.get(props, ['params', 'returnId'])
        const nextReturnId = _.get(nextProps, ['params', 'returnId'])
        const prevTab = _.get(props, ['location', 'query', 'tab'])
        const nextTab = _.get(nextProps, ['location', 'query', 'tab'])
        return (prevReturnId !== nextReturnId || prevTab !== nextTab) && nextTab === 'return'
    }, ({dispatch, params}) => {
        const returnId = _.toInteger(_.get(params, 'returnId'))
        if (returnId > ZERO) {
            dispatch(returnItemReturnFetchAction(returnId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const returnId = _.get(nextProps, ['params', 'returnId'])

        return returnId && _.get(props, ['params', 'returnId']) !== returnId
    }, ({dispatch, params}) => {
        const returnId = _.toInteger(_.get(params, 'returnId'))
        returnId && dispatch(returnItemFetchAction(returnId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevReturn = _.toInteger(_.get(props, ['location', 'query', 'openReturnItemReturnDialog']))
        const nextReturn = _.toInteger(_.get(nextProps, ['location', 'query', 'openReturnItemReturnDialog']))
        return prevReturn !== nextReturn && nextReturn > ZERO
    }, ({dispatch, location}) => {
        const returnItemId = _.toInteger(_.get(location, ['query', 'openReturnItemReturnDialog']))
        if (returnItemId > ZERO) {
            dispatch(returnReturnListAction(returnItemId))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openPrint', 'setOpenPrint', false),

    withHandlers({
        handleOpenPrintDialog: props => () => {
            const {setOpenPrint, dispatch, filter} = props
            setOpenPrint(true)
            dispatch(returnListPintFetchAction(filter))
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
            dispatch(returnDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(returnListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'data', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'data', 'toDate']) || null
            const deliveryFromDate = _.get(filterForm, ['values', 'deliveryDate', 'fromDate']) || null
            const deliveryToDate = _.get(filterForm, ['values', 'deliveryDate', 'toDate']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const shop = _.get(filterForm, ['values', 'shop', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const zone = _.get(filterForm, ['values', 'zone', 'value']) || null
            const dept = _.get(filterForm, ['values', 'dept', 'value']) || null
            const initiator = _.get(filterForm, ['values', 'initiator', 'value']) || null

            filter.filterBy({
                [RETURN_FILTER_OPEN]: false,
                [RETURN_FILTER_KEY.CLIENT]: client,
                [RETURN_FILTER_KEY.STATUS]: status,
                [RETURN_FILTER_KEY.INITIATOR]: initiator,
                [RETURN_FILTER_KEY.ZONE]: zone,
                [RETURN_FILTER_KEY.SHOP]: shop,
                [RETURN_FILTER_KEY.DIVISION]: division,
                [RETURN_FILTER_KEY.DEPT]: dept,
                [RETURN_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.DELIVERY_FROM_DATE]: deliveryFromDate && deliveryFromDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.DELIVERY_TO_DATE]: deliveryToDate && deliveryToDate.format('YYYY-MM-DD')
            })
        },

        handleOpenCancelReturnReturnDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_RETURN_DIALOG_OPEN]: id})})
        },

        handleCloseCancelReturnReturnDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_RETURN_DIALOG_OPEN]: false})})
        },
        handleSubmitCancelReturnReturnDialog: props => () => {
            const {dispatch, filter, params, location: {pathname, query}} = props
            const returnReturnId = _.toInteger(_.get(query, CANCEL_RETURN_RETURN_DIALOG_OPEN))
            const returnId = _.toInteger(_.get(params, 'returnId'))
            return dispatch(returnReturnCancelAction(returnReturnId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отменена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_RETURN_DIALOG_OPEN]: false})})
                    dispatch(returnItemReturnFetchAction(returnId))
                    dispatch(returnItemFetchAction(returnId))
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
                            form: 'ReturnCreateForm',
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
            const {dispatch, filter, setOpenPrint} = props
            setOpenPrint(true)
            return dispatch(returnListPintFetchAction(filter, id))
                .then(() => {
                    window.print()
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
        payment,
        detailLoading,
        returnDataLoading,
        filter,
        layout,
        products,
        openPrint,
        paymentLoading,
        params,
        listPrint,
        listPrintLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', RETURN_FILTER_OPEN]))
    const openCancelReturnReturnDialog = _.toInteger(_.get(location, ['query', CANCEL_RETURN_RETURN_DIALOG_OPEN]))
    const client = _.toInteger(filter.getParam(RETURN_FILTER_KEY.CLIENT))
    const zone = _.toInteger(filter.getParam(RETURN_FILTER_KEY.ZONE))
    const returnStatus = _.toInteger(filter.getParam(RETURN_FILTER_KEY.STATUS))
    const fromDate = filter.getParam(RETURN_FILTER_KEY.FROM_DATE)
    const deliveryFromDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_FROM_DATE)
    const toDate = filter.getParam(RETURN_FILTER_KEY.TO_DATE)
    const deliveryToDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_TO_DATE)
    const detailId = _.toInteger(_.get(params, 'returnId'))

    const cancelReturnReturnDialog = {
        openCancelReturnReturnDialog,
        handleOpenCancelReturnReturnDialog: props.handleOpenCancelReturnReturnDialog,
        handleCloseCancelReturnReturnDialog: props.handleCloseCancelReturnReturnDialog,
        handleSubmitCancelReturnReturnDialog: props.handleSubmitCancelReturnReturnDialog
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
            client: {
                value: client
            },
            returnStatus: {
                value: returnStatus
            },
            zone: {
                value: zone
            },
            deliveryDate: {
                deliveryFromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                deliveryToDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
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

    const paymentData = {
        id: detailId,
        data: payment,
        paymentLoading
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
                filter={filter}
                listData={listData}
                detailData={detailData}
                returnListData={returnReturnList}
                paymentData={paymentData}
                getDocument={getDocument}
                confirmDialog={confirmDialog}
                returnDataLoading={returnDataLoading}
                filterDialog={filterDialog}
                products={products}
                printDialog={printDialog}
                cancelReturnReturnDialog={cancelReturnReturnDialog}
            />
        </Layout>
    )
})

export default ReturnList
