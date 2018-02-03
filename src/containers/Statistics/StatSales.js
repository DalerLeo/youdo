import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import {compose, withHandlers, withPropsOnChange, withState} from 'recompose'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import * as serializers from '../../serializers/Statistics/statSalesSerializer'
import getDocuments from '../../helpers/getDocument'
import {StatSalesGridList, STAT_SALES_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_SALES_FILTER_KEY} from '../../components/Statistics/Sales/SalesGridList'
import {orderItemFetchAction} from '../../actions/order'
import * as API from '../../constants/api'
import {
    statSalesDataFetchAction,
    orderListFetchAction,
    orderStatsFetchAction
} from '../../actions/statSales'
import getConfig from '../../helpers/getConfig'

const ONE = 1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const graphList = _.get(state, ['statSales', 'data', 'data'])
        const graphLoading = _.get(state, ['statSales', 'data', 'loading'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const stats = _.get(state, ['statSales', 'stats', 'data'])
        const statsLoading = _.get(state, ['statSales', 'stats', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const hasMarket = toBoolean(getConfig('MARKETS_MODULE'))
        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            graphList,
            graphLoading,
            stats,
            statsLoading,
            hasMarket
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter, ONE))
        dispatch(orderStatsFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            STAT_SALES_DIALOG_OPEN: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statSalesDataFetchAction(filter, ONE))
    }),
    withPropsOnChange((props, nextProps) => {
        const saleId = _.get(nextProps, ['params', 'statSaleId'])
        return saleId && _.get(props, ['params', 'statSaleId']) !== saleId
    }, ({dispatch, params}) => {
        const saleId = _.toInteger(_.get(params, 'statSaleId'))
        saleId && dispatch(orderItemFetchAction(saleId))
    }),
    withState('salesInfoDialog', 'setSalesInfoDialog', false),

    withHandlers({
        handleOpenStatSaleDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATISTICS_SALES_ITEM_PATH, id),
                query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: true})
            })
        },

        handleCloseStatSaleDialog: props => () => {
            const {filter} = props
            hashHistory.push({
                pathname: ROUTER.STATISTICS_SALES_URL,
                query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: false})
            })
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'createdDate', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'createdDate', 'toDate']) || null
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
                [STAT_SALES_FILTER_KEY.CLIENT]: joinArray(client),
                [STAT_SALES_FILTER_KEY.STATUS]: joinArray(status),
                [STAT_SALES_FILTER_KEY.PRODUCT]: joinArray(product),
                [STAT_SALES_FILTER_KEY.INITIATOR]: joinArray(initiator),
                [STAT_SALES_FILTER_KEY.ZONE]: joinArray(zone),
                [STAT_SALES_FILTER_KEY.SHOP]: joinArray(shop),
                [STAT_SALES_FILTER_KEY.DIVISION]: joinArray(division),
                [STAT_SALES_FILTER_KEY.DEPT]: dept,
                [STAT_SALES_FILTER_KEY.ONLY_BONUS]: onlyBonus,
                [STAT_SALES_FILTER_KEY.EXCLUDE]: exclude,
                [STAT_SALES_FILTER_KEY.DELIVERY_MAN]: _.join(deliveryMan, '-'),
                [STAT_SALES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DEADLINE_FROM_DATE]: deadlineFromDate && deadlineFromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DEADLINE_TO_DATE]: deadlineToDate && deadlineToDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DELIVERY_FROM_DATE]: deliveryFromDate && deliveryFromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DELIVERY_TO_DATE]: deliveryToDate && deliveryToDate.format('YYYY-MM-DD')
            })
        },
        handleGetOrderListDocument: props => () => {
            const {filter} = props
            const params = serializers.orderListFilterSerializer(filter.getParams())
            getDocuments(API.STAT_SALES_GET_DOCUMENT, params)
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const print = true
            const params = serializers.listFilterSerializer(filter.getParams(), null, null, print)
            getDocuments(API.ORDER_EXCEL, params)
        },
        handleGetReleaseDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams(), null)
            getDocuments(API.ORDER_SALES_RELEASE, params)
        }
    })
)

const StatSalesList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        returnData,
        params,
        graphList,
        graphLoading,
        salesInfoDialog,
        setSalesInfoDialog,
        stats,
        statsLoading,
        hasMarket
    } = props

    const detailId = _.toInteger(_.get(params, 'statSaleId'))
    const openStatSaleDialog = toBoolean(_.get(location, ['query', STAT_SALES_DIALOG_OPEN]))

    const client = filter.getParam(STAT_SALES_FILTER_KEY.CLIENT)
    const dept = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.DEPT))
    const initiator = filter.getParam(STAT_SALES_FILTER_KEY.INITIATOR)
    const zone = filter.getParam(STAT_SALES_FILTER_KEY.ZONE)
    const deliveryMan = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_MAN)
    const shop = filter.getParam(STAT_SALES_FILTER_KEY.SHOP)
    const product = filter.getParam(STAT_SALES_FILTER_KEY.PRODUCT)
    const division = filter.getParam(STAT_SALES_FILTER_KEY.DIVISION)
    const status = filter.getParam(STAT_SALES_FILTER_KEY.STATUS)
    const deliveryFromDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_TO_DATE)
    const createdFromDate = filter.getParam(STAT_SALES_FILTER_KEY.FROM_DATE)
    const createdToDate = filter.getParam(STAT_SALES_FILTER_KEY.TO_DATE)
    const deadlineFromDate = filter.getParam(STAT_SALES_FILTER_KEY.DEADLINE_FROM_DATE)
    const deadlineToDate = filter.getParam(STAT_SALES_FILTER_KEY.DEADLINE_TO_DATE)
    const onlyBonus = filter.getParam(STAT_SALES_FILTER_KEY.ONLY_BONUS)
    const exclude = filter.getParam(STAT_SALES_FILTER_KEY.EXCLUDE)
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: _.get(list, 'results') || {},
        listLoading
    }
    const statSaleDialog = {
        openStatSaleDialog,
        handleCloseStatSaleDialog: props.handleCloseStatSaleDialog,
        handleOpenStatSaleDialog: props.handleOpenStatSaleDialog
    }
    const detailData = {
        id: detailId,
        data: detail || {},
        return: returnData || {},
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const statsData = {
        data: stats,
        loading: statsLoading
    }

    const filterForm = {
        initialValues: {
            client: client && splitToArray(client),
            status: status && splitToArray(status),
            division: division && splitToArray(division),
            shop: shop && splitToArray(shop),
            product: product && splitToArray(product),
            initiator: initiator && splitToArray(initiator),
            dept: {
                value: dept
            },
            zone: zone && splitToArray(zone),
            deliveryMan: deliveryMan && splitToArray(deliveryMan),
            deliveryDate: {
                fromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                toDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
            },
            createdDate: {
                fromDate: createdFromDate ? moment(createdFromDate, 'YYYY-MM-DD') : moment(firstDayOfMonth),
                toDate: createdToDate ? moment(createdToDate, 'YYYY-MM-DD') : moment(lastDayOfMonth)
            },
            deadlineDate: {
                fromDate: deadlineFromDate && moment(deadlineFromDate, 'YYYY-MM-DD'),
                toDate: deadlineToDate && moment(deadlineToDate, 'YYYY-MM-DD')
            },
            onlyBonus: onlyBonus,
            exclude: exclude,
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }

    }

    const graphData = {
        data: graphList || {},
        graphLoading: graphLoading
    }

    const downloadDocuments = {
        handleGetReleaseDocument: props.handleGetReleaseDocument,
        handleGetOrderListDocument: props.handleGetOrderListDocument,
        handleGetDocument: props.handleGetDocument
    }

    const order = false
    return (
        <Layout {...layout}>
            <StatSalesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statSaleDialog={statSaleDialog}
                type={order}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                onSubmit={props.handleSubmitFilterDialog}
                graphData={graphData}
                salesInfoDialog={salesInfoDialog}
                setSalesInfoDialog={setSalesInfoDialog}
                hasMarket={hasMarket}
                downloadDocuments={downloadDocuments}
                statsData={statsData}
            />
        </Layout>
    )
})

export default StatSalesList
