import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import * as serializers from '../../serializers/Statistics/statSalesSerializer'
import getDocuments from '../../helpers/getDocument'
import {StatSalesGridList, STAT_SALES_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_SALES_FILTER_KEY} from '../../components/Statistics/Sales/SalesGridList'
import {
    orderItemFetchAction
} from '../../actions/order'
import * as API from '../../constants/api'
import {
    statSalesDataFetchAction,
    orderListFetchAction
}
from '../../actions/statSales'
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
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            graphList,
            graphLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter, ONE))
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && (props.query.fromDate !== nextProps.query.fromDate || props.query.toDate !== nextProps.query.toDate)
    }, ({dispatch, filter}) => {
        dispatch(statSalesDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const saleId = _.get(nextProps, ['params', 'statSaleId'])
        return saleId && _.get(props, ['params', 'statSaleId']) !== saleId
    }, ({dispatch, params}) => {
        const saleId = _.toInteger(_.get(params, 'statSaleId'))
        saleId && dispatch(orderItemFetchAction(saleId))
    }),

    withHandlers({
        handleOpenStatSaleDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_SALES_ITEM_PATH, id), query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: true})})
        },

        handleCloseStatSaleDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_SALES_URL, query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: false})})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const deliveryFromDate = _.get(filterForm, ['values', 'deliveryDate', 'fromDate']) || null
            const deliveryToDate = _.get(filterForm, ['values', 'deliveryDate', 'toDate']) || null
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const shop = _.get(filterForm, ['values', 'shop', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const zone = _.get(filterForm, ['values', 'zone', 'value']) || null
            const dept = _.get(filterForm, ['values', 'dept', 'value']) || null
            const initiator = _.get(filterForm, ['values', 'initiator', 'value']) || null
            const onlyBonus = _.get(filterForm, ['values', 'onlyBonus']) || null
            const exclude = _.get(filterForm, ['values', 'exclude']) || null

            filter.filterBy({
                [STAT_SALES_FILTER_KEY.CLIENT]: client,
                [STAT_SALES_FILTER_KEY.STATUS]: status,
                [STAT_SALES_FILTER_KEY.INITIATOR]: initiator,
                [STAT_SALES_FILTER_KEY.ZONE]: zone,
                [STAT_SALES_FILTER_KEY.SHOP]: shop,
                [STAT_SALES_FILTER_KEY.DIVISION]: division,
                [STAT_SALES_FILTER_KEY.DEPT]: dept,
                [STAT_SALES_FILTER_KEY.ONLY_BONUS]: onlyBonus,
                [STAT_SALES_FILTER_KEY.EXCLUDE]: exclude,
                [STAT_SALES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DELIVERY_FROM_DATE]: deliveryFromDate && deliveryFromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DELIVERY_TO_DATE]: deliveryToDate && deliveryToDate.format('YYYY-MM-DD')
            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.orderListFilterSerializer(filter.getParams())
            getDocuments(API.STAT_SALES_GET_DOCUMENT, params)
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
        graphLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statSaleId'))
    const openStatSaleDialog = toBoolean(_.get(location, ['query', STAT_SALES_DIALOG_OPEN]))

    const client = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.CLIENT))
    const dept = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.DEPT))
    const initiator = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.INITIATOR))
    const zone = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.ZONE))
    const orderStatus = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.STATUS))
    const shop = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.SHOP))
    const division = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.DIVISION))
    const status = _.toInteger(filter.getParam(STAT_SALES_FILTER_KEY.STATUS))
    const deliveryFromDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(STAT_SALES_FILTER_KEY.DELIVERY_TO_DATE)
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

    const filterForm = {
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
            initiator: {
                value: initiator
            },
            dept: {
                value: dept
            },
            zone: {
                value: zone
            },
            deliveryDate: {
                fromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                toDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
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
        graphLoading
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
            />
        </Layout>
    )
})

export default StatSalesList
