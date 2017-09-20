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
import {
    STOCK_RECEIVE_HISTORY_INFO_DIALOG_OPEN,
    HISTORY_FILTER_OPEN,
    HISTORY_FILTER_KEY,
    SROCK_POPVER_DIALOG_OPEN,
    TAB,
    STOCK_CONFIRM_DIALOG_OPEN,
    TAB_TRANSFER_FILTER_KEY
} from '../../components/StockReceive'
import StockTabReceive from '../../components/StockReceive/StockTabReceive'
import {
    stockReceiveListFetchAction,
    stockReceiveItemFetchAction,
    stockReceiveItemConfirmAction,
    stockReceiveDeliveryConfirmAction,
} from '../../actions/stockReceive'
import {orderListPintFetchAction} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'

const TYPE = 'openType'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['stockReceiveContent', 'item', 'data'])
        const detailProducts = _.get(state, ['stockReceive', 'item', 'data'])
        const detailLoading = _.get(state, ['stockReceive', 'item', 'loading'])
        const list = _.get(state, ['stockReceiveContent', 'list', 'data'])
        const listLoading = _.get(state, ['stockReceiveContent', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailProducts,
            detailLoading,
            filter
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || 'receive'
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || 'receive'
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || (prevTab !== nextTab)
    }, ({dispatch, filter}) => {
        dispatch(stockReceiveListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'stockReceiveId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'stockReceiveId']))
        return prevId !== nextId
    }, ({dispatch, params}) => {
        const stockReceiveId = _.toInteger(_.get(params, 'stockReceiveId'))
        dispatch(stockReceiveItemFetchAction(stockReceiveId))
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

const StockReceive = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const detailType = _.get(location, ['query', TYPE])
    const detailId = _.toInteger(_.get(params, 'stockReceiveId'))
    const openFilterDialog = toBoolean(_.get(location, ['query', HISTORY_FILTER_OPEN]))
    const brand = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.BRAND))
    const stock = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.TYPE))
    const productType = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT_TYPE))
    const product = _.toInteger(filter.getParam(HISTORY_FILTER_KEY.PRODUCT))
    const fromDate = filter.getParam(HISTORY_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(HISTORY_FILTER_KEY.TO_DATE)

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleOpenDetail: props.handleOpenDetail
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

    document.getElementById('wrapper').style.height = '100%'

    return (
        <Layout {...layout}>
            <StockTabReceive
                filter={filter}
                listData={listData}
                filterDialog={filterDialog}
                detailData={detailData}
            />
        </Layout>
    )
})

export default StockReceive
