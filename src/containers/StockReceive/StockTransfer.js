import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import StockTabTransfer from '../../components/StockReceive/StockTabTransfer'
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statAgentSerializer'
import moment from 'moment'

import {
    StatAgentGridList,
    STAT_TRANSFER_DIALOG_OPEN,
    DATE
} from '../../components/Statistics'
import {STAT_AGENT_FILTER_KEY} from '../../components/Statistics/Agents/StatAgentFilterForm'
import {
    statAgentListFetchAction,
    statAgentItemFetchAction
} from '../../actions/statAgent'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['stockReceive', 'transfer', 'data'])
        const listLoading = _.get(state, ['stockReceive', 'transfer', 'loading'])
        const detail = _.get(state, ['stockReceive', 'transferItem', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'transferItem', 'loading'])
        const filterForm = _.get(state, ['form', 'TabTransferFilterForm'])
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
    withState('openPrint', 'setOpenPrint', false),
    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        dispatch(stockTransferListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockReceiveId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockReceiveId']))
        return prevId !== nextId
    }, ({dispatch, params, }) => {
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        dispatch(stockReceiveOrderItemFetchAction(stockReceiveId))
        dispatch(stockTransferItemFetchAction(stockReceiveId))
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

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_FILTER_DIALOG]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_FILTER_DIALOG]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname, query}} = props
            hashHistory.push({pathname, ''})
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
                [STOCK_TRANSFER_DIALOG]: false,
                [STOCK_TRANSFER_FILTER_KEY.STOCK]: stock,
                [STOCK_TRANSFER_FILTER_KEY.TYPE]: type,
                [STOCK_TRANSFER_FILTER_KEY.ACCEPTANCE_FROM_DATE]: acceptanceFromData && moment(acceptanceFromData).format('YYYY-MM-DD'),
                [STOCK_TRANSFER_FILTER_KEY.ACCEPTANCE_TO_DATE]: acceptanceToDate && moment(acceptanceToDate).format('YYYY-MM-DD'),
                [STOCK_TRANSFER_FILTER_KEY.FROM_DATE]: fromDate && moment(fromDate).format('YYYY-MM-DD'),
                [STOCK_TRANSFER_FILTER_KEY.TO_DATE]: toDate && moment(toDate).format('YYYY-MM-DD')

            })
        },
        handleOpenConfirmDialog: props => (status) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_CONFIRM_DIALOG_OPEN]: status})})
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_CONFIRM_DIALOG_OPEN]: false})})
        },
        handleSubmitOrderReturnDialog: props => () => {
            const {dispatch, filter, location: {pathname}, params} = props
            const id = _.toInteger(_.get(params, 'stockReceiveId'))
            return dispatch(stockReceiveItemReturnAction(id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_CONFIRM_DIALOG_OPEN]: false})})
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
                    hashHistory.push({pathname, query: filter.getParams({[STOCK_TRANSFER_CONFIRM_DIALOG_OPEN]: false})})
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
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STOCK_RECEIVE_LIST_URL, query: filter.getParams({[STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false})})
        },
        handleOpenDetail: props => (id, type, typeOrg) => {
            const {filter, location: {pathname}} = props
            if (typeOrg === 'transfer') {
                hashHistory.push({
                    pathname,
                    query: filter.getParams({[TYPE]: type, [STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: id, [SROCK_POPVER_DIALOG_OPEN]: id})
                })
            } else {
                hashHistory.push({
                    pathname: sprintf(ROUTER.STOCK_RECEIVE_ITEM_PATH, id),
                    query: filter.getParams({[TYPE]: type, [STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN]: false, [SROCK_POPVER_DIALOG_OPEN]: false})
                })
            }
        }
    })
)

const StockTransfer = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterForm,
        params
    } = props

    const openStatAgentDialog = toBoolean(_.get(location, ['query', STAT_TRANSFER_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'stockTransferId'))
    const openFilterDialog = toBoolean(_.get(location, ['query', STOCK_TRANSFER_DIALOG]))


    const statAgentDialog = {
        openStatAgentDialog,
        handleCloseStatAgentDialog: props.handleCloseStatAgentDialog,
        handleOpenStatAgentDialog: props.handleOpenStatAgentDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const agentDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const filterDateRange = (_.get(filterForm, ['values', 'date', 'fromDate']) && _.get(filterForm, ['values', 'date', 'toDate'])) ? {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']),
        'toDate': _.get(filterForm, ['values', 'date', 'toDate'])
    } : {}

    const detailData = {
        filter: filter,
        id: detailId,
        data: detail,
        agentDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
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

    const printDialog = {
        openPrint,
        handleOpenPrintDialog: props.handleOpenPrintDialog,
        handleClosePrintDialog: props.handleClosePrintDialog
    }
    return (
        <Layout {...layout}>
            <StockTabTransfer
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                filterDialog={filterDialog}
                printDialog={printDialog}/>
        </Layout>
    )
})

export default StockTransfer
