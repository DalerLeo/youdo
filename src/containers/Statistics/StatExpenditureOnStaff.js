import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {joinArray} from '../../helpers/joinSplitValues'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import {StatExpenditureOnStaffGridList} from '../../components/Statistics'
import {STAT_EXPENDITURE_ON_STAFF_FILTER_KEY} from '../../components/Statistics/ExpenditureOnStaff/StatExpenditureOnStaffGridList'
import {
    statExpenditureOnStaffListFetchAction,
    getTransactionData
} from '../../actions/statExpenditureOnStaff'
import toBoolean from '../../helpers/toBoolean'

const OPEN_TRANSACTION_DIALOG = 'openTransactionDialog'
const defaultDate = moment().format('YYYY-MM-DD')
const BEGIN_DATE = 'fromDate'
const END_DATE = 'toDate'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['statExpenditureOnStaff', 'list', 'data'])
        const listLoading = _.get(state, ['statExpenditureOnStaff', 'list', 'loading'])
        const transactionData = _.get(state, ['statExpenditureOnStaff', 'transactionData', 'data'])
        const transactionDataLoading = _.get(state, ['statExpenditureOnStaff', 'transactionData', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterTransaction = filterHelper(transactionData, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
        const beginDate = _.get(query, BEGIN_DATE) || defaultDate
        const endDate = _.get(query, END_DATE) || defaultDate

        return {
            list,
            listLoading,
            transactionData,
            transactionDataLoading,
            filter,
            query,
            filterForm,
            filterTransaction,
            beginDate,
            endDate
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            dPage: null,
            dPageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statExpenditureOnStaffListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevOpen = _.get(props, ['location', 'query', 'openTransactionDialog'])
        const nextOpen = _.get(nextProps, ['location', 'query', 'openTransactionDialog'])
        return props.filterTransaction.filterRequest() !== nextProps.filterTransaction.filterRequest() || (prevOpen !== nextOpen && _.toNumber(nextOpen) > ZERO)
    }, ({dispatch, filter, location, filterTransaction}) => {
        const nextOpen = _.toNumber(_.get(location, ['query', [OPEN_TRANSACTION_DIALOG]]))
        if (nextOpen > ZERO) {
            dispatch(getTransactionData(filter, filterTransaction, nextOpen))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense']) || null

            filter.filterBy({
                [STAT_EXPENDITURE_ON_STAFF_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_EXPENDITURE_ON_STAFF_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_EXPENDITURE_ON_STAFF_FILTER_KEY.CATEGORY_EXPENSE]: joinArray(categoryExpense)
            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            // You must change action function
            return dispatch(getTransactionData(filter))
        },
        handleOpenTransactionDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_TRANSACTION_DIALOG]: id})})
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
        filter,
        layout,
        filterForm,
        location,
        transactionData,
        transactionDataLoading,
        filterTransaction,
        beginDate,
        endDate
    } = props

    const openTransactionDialog = _.toNumber(_.get(location, ['query', [OPEN_TRANSACTION_DIALOG]]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: _.get(list, 'results'),
        listLoading
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
        handleCloseTransactionDialog: props.handleCloseTransactionDialog,
        beginDate,
        endDate
    }

    return (
        <Layout {...layout}>
            <StatExpenditureOnStaffGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                getDocument={getDocument}
                initialValues={initialValues}
                filterForm={filterForm}
                transactionData={transactionDialog}
                filterTransaction={filterTransaction}
            />
        </Layout>
    )
})

export default StatExpenditureOnStaffList
