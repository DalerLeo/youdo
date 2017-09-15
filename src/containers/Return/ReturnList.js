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
import {openErrorAction} from '../../actions/error'

import {
    RETURN_FILTER_KEY,
    RETURN_FILTER_OPEN,
    CANCEL_RETURN_DIALOG_OPEN,
    ReturnGridList,
    ReturnPrint
} from '../../components/Return'
import {
    returnListFetchAction,
    returnItemFetchAction,
    returnListPrintFetchAction,
    returnCancelAction
} from '../../actions/return'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['return', 'item', 'data'])
        const detailLoading = _.get(state, ['return', 'item', 'loading'])
        const updateLoading = _.get(state, ['return', 'update', 'loading'])
        const list = _.get(state, ['return', 'list', 'data'])
        const listPrint = _.get(state, ['return', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['return', 'listPrint', 'loading'])
        const listLoading = _.get(state, ['return', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ReturnFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            listPrintLoading,
            listPrint,
            detailLoading,
            updateLoading,
            filter,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
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

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openPrint', 'setOpenPrint', false),

    withHandlers({
        handleOpenPrintDialog: props => () => {
            const {dispatch, setOpenPrint} = props
            setOpenPrint(true)
            return dispatch(returnListPrintFetchAction())
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
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors') && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
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
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'data', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'data', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const order = _.get(filterForm, ['values', 'order', 'value']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const market = _.get(filterForm, ['values', 'market', 'value']) || null
            const initiator = _.get(filterForm, ['values', 'initiator', 'value']) || null
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const code = _.get(filterForm, ['values', 'code']) || null

            filter.filterBy({
                [RETURN_FILTER_OPEN]: false,
                [RETURN_FILTER_KEY.TYPE]: type,
                [RETURN_FILTER_KEY.ORDER]: order,
                [RETURN_FILTER_KEY.CLIENT]: client,
                [RETURN_FILTER_KEY.STATUS]: status,
                [RETURN_FILTER_KEY.INITIATOR]: initiator,
                [RETURN_FILTER_KEY.MARKET]: market,
                [RETURN_FILTER_KEY.PRODUCT]: product,
                [RETURN_FILTER_KEY.CODE]: code,
                [RETURN_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [RETURN_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
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
                    return dispatch(openSnackbarAction({message: 'Успешно отменена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CANCEL_RETURN_DIALOG_OPEN]: false})})
                    dispatch(returnListFetchAction(filter))
                    dispatch(returnItemFetchAction(orderId))
                })
        },

        handleGetDocument: props => (id) => {
            const {dispatch, setOpenPrint} = props
            setOpenPrint(true)
            return dispatch(returnListPrintFetchAction(id))
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
        detailLoading,
        returnDataLoading,
        filter,
        layout,
        products,
        openPrint,
        params,
        listPrint,
        listPrintLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', RETURN_FILTER_OPEN]))
    const openCancelDialog = _.toInteger(_.get(location, ['query', CANCEL_RETURN_DIALOG_OPEN]))
    const client = _.toInteger(filter.getParam(RETURN_FILTER_KEY.CLIENT))
    const zone = _.toInteger(filter.getParam(RETURN_FILTER_KEY.ZONE))
    const returnStatus = _.toInteger(filter.getParam(RETURN_FILTER_KEY.STATUS))
    const fromDate = filter.getParam(RETURN_FILTER_KEY.FROM_DATE)
    const deliveryFromDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_FROM_DATE)
    const toDate = filter.getParam(RETURN_FILTER_KEY.TO_DATE)
    const deliveryToDate = filter.getParam(RETURN_FILTER_KEY.DELIVERY_TO_DATE)
    const detailId = _.toInteger(_.get(params, 'returnId'))

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
                getDocument={getDocument}
                confirmDialog={confirmDialog}
                returnDataLoading={returnDataLoading}
                filterDialog={filterDialog}
                products={products}
                printDialog={printDialog}
                cancelReturnDialog={cancelReturnDialog}
            />
        </Layout>
    )
})

export default ReturnList
