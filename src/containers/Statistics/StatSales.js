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
import toBoolean from '../../helpers/toBoolean'
import * as serializers from '../../serializers/Statistics/statSalesSerializer'
import getDocuments from '../../helpers/getDocument'
import {StatSalesGridList, STAT_SALES_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_SALES_FILTER_KEY} from '../../components/Statistics/Sales/SalesGridList'
import {orderItemFetchAction} from '../../actions/order'
import * as API from '../../constants/api'
import {
    statSalesDataFetchAction,
    statSalesReturnDataFetchAction,
    orderListFetchAction,
    orderListPintFetchAction
} from '../../actions/statSales'
import {OrderPrint} from '../../components/Order'

const ONE = 1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const graphList = _.get(state, ['statSales', 'data', 'data'])
        const graphLoading = _.get(state, ['statSales', 'data', 'loading'])
        const graphReturnList = _.get(state, ['statSales', 'returnList', 'data'])
        const graphReturnLoading = _.get(state, ['statSales', 'returnList', 'loading'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const listPrint = _.get(state, ['order', 'listPrint', 'data'])
        const listPrintLoading = _.get(state, ['order', 'listPrint', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            graphReturnList,
            graphReturnLoading,
            filter,
            filterForm,
            graphList,
            graphLoading,
            listPrint,
            listPrintLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter, ONE))
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
        dispatch(statSalesReturnDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const saleId = _.get(nextProps, ['params', 'statSaleId'])
        return saleId && _.get(props, ['params', 'statSaleId']) !== saleId
    }, ({dispatch, params}) => {
        const saleId = _.toInteger(_.get(params, 'statSaleId'))
        saleId && dispatch(orderItemFetchAction(saleId))
    }),

    withState('openPrint', 'setOpenPrint', false),
    withState('openDeliveryPrint', 'setOpenDeliveryPrint', false),

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
                [STAT_SALES_FILTER_KEY.CLIENT]: _.join(client, '-'),
                [STAT_SALES_FILTER_KEY.STATUS]: _.join(status, '-'),
                [STAT_SALES_FILTER_KEY.PRODUCT]: _.join(product, '-'),
                [STAT_SALES_FILTER_KEY.INITIATOR]: _.join(initiator, '-'),
                [STAT_SALES_FILTER_KEY.ZONE]: _.join(zone, '-'),
                [STAT_SALES_FILTER_KEY.SHOP]: _.join(shop, '-'),
                [STAT_SALES_FILTER_KEY.DIVISION]: _.join(division, '-'),
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
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.orderListFilterSerializer(filter.getParams())
            getDocuments(API.STAT_SALES_GET_DOCUMENT, params)
        },
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
        graphReturnList,
        graphReturnLoading,
        filter,
        layout,
        returnData,
        params,
        graphList,
        graphLoading,
        openPrint,
        listPrint,
        listPrintLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statSaleId'))
    const openStatSaleDialog = toBoolean(_.get(location, ['query', STAT_SALES_DIALOG_OPEN]))

    const client = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.CLIENT))
    const dept = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.DEPT))
    const initiator = filter.getParam(STAT_SALES_FILTER_KEY.INITIATOR)
    const zone = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.ZONE))
    const deliveryMan = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_MAN)
    const shop = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.SHOP))
    const product = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.PRODUCT))
    const division = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.DIVISION))
    const status = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.STATUS))
    const deliveryFromDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_TO_DATE)
    const createdFromDate = filter.getParam(STAT_SALES_FILTER_KEY.FROM_DATE)
    const createdToDate = filter.getParam(STAT_SALES_FILTER_KEY.TO_DATE)
    const deadlineFromDate = filter.getParam(STAT_SALES_FILTER_KEY.DEADLINE_FROM_DATE)
    const deadlineToDate = filter.getParam(STAT_SALES_FILTER_KEY.DEADLINE_TO_DATE)
    const onlyBonus = filter.getParam(STAT_SALES_FILTER_KEY.ONLY_BONUS)
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

    const filterForm = {
        initialValues: {
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            status: status && _.map(_.split(status, '-'), (item) => {
                return _.toNumber(item)
            }),
            division: division && _.map(_.split(division, '-'), (item) => {
                return _.toNumber(item)
            })
        },
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
        createdDate: {
            fromDate: createdFromDate && moment(createdFromDate, 'YYYY-MM-DD'),
            toDate: createdToDate && moment(createdToDate, 'YYYY-MM-DD')
        },
        deadlineDate: {
            fromDate: deadlineFromDate && moment(deadlineFromDate, 'YYYY-MM-DD'),
            toDate: deadlineToDate && moment(deadlineToDate, 'YYYY-MM-DD')
        },
        onlyBonus: onlyBonus,
        exclude: true,
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }
    const mergedGraph = {}
    if (!graphReturnLoading) {
        _.map(graphList, (item) => {
            mergedGraph[item.date] = {'in': item.amount, date: item.date}
        })

        _.map(graphReturnList, (item) => {
            if (mergedGraph[item.date]) {
                mergedGraph[item.date] = {'in': mergedGraph[item.date].in, 'out': item.totalAmount, date: item.date}
            } else {
                mergedGraph[item.date] = {'in': 0, 'out': item.totalAmount, date: item.date}
            }
        })
    }

    const graphData = {
        mergedGraph: _.sortBy(mergedGraph, ['date']),
        data: graphList || {},
        graphLoading: graphLoading || graphReturnLoading,
        graphReturnList
    }

    const printDialog = {
        openPrint,
        handleOpenPrintDialog: props.handleOpenPrintDialog,
        handleClosePrintDialog: props.handleClosePrintDialog
    }
    const listPrintData = {
        data: listPrint,
        listPrintLoading
    }
    if (openPrint) {
        document.getElementById('wrapper').style.height = 'auto'

        return <OrderPrint
            printDialog={printDialog}
            listPrintData={listPrintData}/>
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
                handleGetDocument={props.handleGetDocument}
                printDialog={printDialog}
            />
        </Layout>
    )
})

export default StatSalesList
