import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import {StatExpenditureOnStaffGridList} from '../../components/Statistics'
import {STAT_EXPENDITURE_ON_STAFF_FILTER_KEY} from '../../components/Statistics/ExpenditureOnStaff/StatExpenditureOnStaffGridList'
import {
    statExpenditureOnStaffListFetchAction,
    statExpenditureOnStaffItemFetchAction,
    getTransactionData
} from '../../actions/statExpenditureOnStaff'
import toBoolean from '../../helpers/toBoolean'

const ZERO = 0
const OPEN_TRANSACTION_DIALOG = 'openTransactionDialog'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statExpenditureOnStaff', 'item', 'data'])
        const detailLoading = _.get(state, ['statExpenditureOnStaff', 'item', 'loading'])
        const list = _.get(state, ['statExpenditureOnStaff', 'list', 'data'])
        const listLoading = _.get(state, ['statExpenditureOnStaff', 'list', 'loading'])
        const transactionData = _.get(state, ['statExpenditureOnStaff', 'transactionData', 'data'])
        const transactionDataLoading = _.get(state, ['statExpenditureOnStaff', 'transactionData', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            transactionData,
            transactionDataLoading,
            filter,
            query,
            filterForm,
            filterItem
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            (!_.get(props, ['params', 'statExpenditureOnStaffId'])) &&
            (!_.get(nextProps, ['params', 'statExpenditureOnStaffId']))
    }, ({dispatch, filter}) => {
        dispatch(statExpenditureOnStaffListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statExpenditureOnStaffId = _.get(nextProps, ['params', 'statExpenditureOnStaffId']) || ZERO
        return statExpenditureOnStaffId > ZERO && _.get(props, ['params', 'statExpenditureOnStaffId']) !== statExpenditureOnStaffId
    }, ({dispatch, params, filter, filterItem}) => {
        const statExpenditureOnStaffId = _.toInteger(_.get(params, 'statExpenditureOnStaffId'))
        if (statExpenditureOnStaffId > ZERO) {
            dispatch(statExpenditureOnStaffItemFetchAction(filter, filterItem, statExpenditureOnStaffId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevOpen = toBoolean(_.get(props, ['localation', 'query', [OPEN_TRANSACTION_DIALOG]]))
        const nextOpen = toBoolean(_.get(nextProps, ['localation', 'query', [OPEN_TRANSACTION_DIALOG]]))
        return prevOpen !== nextOpen && nextOpen
    }, ({dispatch}) => {
        dispatch(getTransactionData())
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_EXPENDITURE_ON_STAFF_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_EXPENDITURE_ON_STAFF_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getTransactionData(filter))
        },
        handleOpenTransactionDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_TRANSACTION_DIALOG]: true})})
        },
        handleCloseTransactionDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_TRANSACTION_DIALOG]: false})})
        }
    })
)

const StatExpenditureOnStaffList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        filterForm,
        location,
        params,
        transactionData,
        transactionDataLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statExpenditureOnStaffId'))
    const openTransactionDialog = toBoolean(_.get(location, ['query', [OPEN_TRANSACTION_DIALOG]]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const outcomeCategoryDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const filterDateRange = {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']) || null,
        'toDate': _.get(filterForm, ['values', 'date', 'toDate']) || null
    }
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        outcomeCategoryDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }
    const transactionDialog = {
        open: openTransactionDialog,
        data: _.get(transactionData, 'results'),
        loading: transactionDataLoading,
        handleOpenTransactionDialog: props.handleOpenTransactionDialog,
        handleCloseTransactionDialog: props.handleCloseTransactionDialog
    }

    return (
        <Layout {...layout}>
            <StatExpenditureOnStaffGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                getDocument={getDocument}
                initialValues={initialValues}
                filterForm={filterForm}
                transactionData={transactionDialog}
            />
        </Layout>
    )
})

export default StatExpenditureOnStaffList
