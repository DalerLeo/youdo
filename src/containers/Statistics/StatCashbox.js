import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statCashboxSerializer'
import getDocuments from '../../helpers/getDocument'
import sprintf from 'sprintf'
import {StatCashboxGridList} from '../../components/Statistics'
import {STAT_CASHBOX_FILTER_KEY} from '../../components/Statistics/Cashbox/StatCashboxGridList'
import {STAT_CASHBOX_DETAIL_FILTER_KEY} from '../../components/Statistics/Cashbox/StatCashboxDetails'
import {
    statCashboxListFetchAction,
    statCashboxItemFetchAction,
    statCashBoxSumDataFetchAction,
    statCashBoxItemDataFetchAction,
    statCashBoxItemSumDataFetchAction
} from '../../actions/statCashbox'
import {transactionListFetchAction} from '../../actions/transaction'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statCashbox', 'item', 'data'])
        const detailLoading = _.get(state, ['statCashbox', 'item', 'loading'])
        const list = _.get(state, ['statCashbox', 'list', 'data'])
        const listLoading = _.get(state, ['statCashbox', 'list', 'loading'])
        const sumData = _.get(state, ['statCashbox', 'sumData', 'data'])
        const sumLoading = _.get(state, ['statCashbox', 'sumData', 'loading'])
        const sumItemData = _.get(state, ['statCashbox', 'itemSumData', 'data'])
        const sumItemDataLoading = _.get(state, ['statCashbox', 'itemSumData', 'loading'])
        const itemGraph = _.get(state, ['statCashbox', 'itemGraph', 'data'])
        const itemGraphLoading = _.get(state, ['statCashbox', 'itemGraph', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const detailFilterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const transactionsList = _.get(state, ['transaction', 'list', 'data'])
        const transactionsLoading = _.get(state, ['transaction', 'list', 'loading'])
        const filterDetail = filterHelper(transactionsList, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            transactionsList,
            transactionsLoading,
            filter,
            filterForm,
            filterDetail,
            detailFilterForm,
            sumData,
            sumLoading,
            itemGraph,
            itemGraphLoading,
            sumItemData,
            sumItemDataLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statCashboxListFetchAction(filter))
        dispatch(statCashBoxSumDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'cashboxId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'cashboxId']))
        return props.filterDetail.filterRequest() !== nextProps.filterDetail.filterRequest() || (prevId !== nextId && nextId > ZERO)
    }, ({dispatch, params, filterDetail}) => {
        const id = _.toInteger(_.get(params, 'cashboxId'))
        if (id > ZERO) {
            dispatch(transactionListFetchAction(filterDetail, id))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toInteger(_.get(props, ['params', 'cashboxId']))
        const nextId = _.toInteger(_.get(nextProps, ['params', 'cashboxId']))
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return props.filterDetail.filterRequest(except) !== nextProps.filterDetail.filterRequest(except) || (prevId !== nextId && nextId > ZERO)
    }, ({dispatch, params, filterDetail}) => {
        const id = _.toInteger(_.get(params, 'cashboxId'))
        if (id > ZERO) {
            dispatch(statCashBoxItemDataFetchAction(filterDetail, id))
            dispatch(statCashboxItemFetchAction(id))
            dispatch(statCashBoxItemSumDataFetchAction(filterDetail, id))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_CASHBOX_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_CASHBOX_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleSubmitDetailFilterDialog: props => () => {
            const {filterDetail, detailFilterForm} = props

            const division = _.get(detailFilterForm, ['values', 'division', 'value']) || null
            const fromDate = _.get(detailFilterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(detailFilterForm, ['values', 'date', 'toDate']) || null
            const search = _.get(detailFilterForm, ['values', 'search']) || null

            filterDetail.filterBy({
                [STAT_CASHBOX_DETAIL_FILTER_KEY.SEARCH]: search,
                [STAT_CASHBOX_DETAIL_FILTER_KEY.DIVISION]: division,
                [STAT_CASHBOX_DETAIL_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_CASHBOX_DETAIL_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleCloseDetail: props => () => {
            hashHistory.push({pathname: ROUTER.STATISTICS_CASHBOX_URL, query: ''})
        },
        handleOpenDetail: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_CASHBOX_ITEM_PATH, id), query: filter.getParams()})
        },
        handleGetCashBoxes: props => () => {
            const {list, filter, dispatch} = props
            _.map(_.get(list, 'results'), (item) => {
                dispatch(statCashBoxItemDataFetchAction(filter, _.get(item, 'id')))
            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_CASHBOX_GET_DOCUMENT, params)
        },
        handleGetDataItem: props => (id) => {
            const {filter, dispatch} = props
            dispatch(statCashBoxItemDataFetchAction(filter, id))
        }
    })
)

const StatCashboxList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        filterDetail,
        layout,
        transactionsList,
        transactionsLoading,
        params,
        location,
        sumData,
        sumLoading,
        handleGetCashBoxes,
        itemGraphLoading,
        itemGraph,
        sumItemData,
        sumItemDataLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'cashboxId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null

    const openDetails = detailId > ZERO

    let detailItem = []

    const listData = {
        detailItem,
        sumData,
        sumLoading,
        handleOpenDetail: props.handleOpenDetail,
        data: _.get(list, 'results'),
        listLoading,
        openDetails
    }

    const detailData = {
        cashboxList: _.get(list, 'results'),
        cashboxListLoading: listLoading,
        itemGraphLoading,
        itemGraph: _.get(itemGraph, 'results'),
        sumItemData,
        sumItemDataLoading,
        id: detailId,
        data: detail,
        transactionData: _.get(transactionsList, 'results'),
        detailLoading,
        transactionsLoading,
        handleCloseDetail: props.handleCloseDetail,
        handleSubmitDetailFilterDialog: props.handleSubmitDetailFilterDialog
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const filterForm = {
        initialValues: {
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }
    const detailFilterForm = {
        initialValues: {
            search: search,
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }

    return (
        <Layout {...layout}>
            <StatCashboxGridList
                filter={filter}
                filterDetail={filterDetail}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                detailFilterForm={detailFilterForm}
                getCashBoxByOne={props.handleGetDataItem}
                handleGetCashBoxes={handleGetCashBoxes}
            />
        </Layout>
    )
})

export default StatCashboxList
