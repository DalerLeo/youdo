import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statFinanceSerializer'
import {StatFinanceGridList} from '../../components/Statistics'
import {hashHistory} from 'react-router'
import {STAT_FINANCE_FILTER_KEY} from '../../components/Statistics/Finance/StatFinanceGridList'
import {
    TRANSACTION_CATEGORY_POPOP_OPEN
} from '../../components/Transaction'

import {
    statFinanceInDataFetchAction,
    statFinanceOutDataFetchAction,
    statFinanceListFetchAction
} from '../../actions/statFianace'
import {transactionCategoryPopopDataAction} from '../../actions/transaction'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphIn = _.get(state, ['statFinance', 'dataIn', 'data'])
        const graphOut = _.get(state, ['statFinance', 'dataOut', 'data'])
        const graphInLoading = _.get(state, ['statFinance', 'dataIn', 'loading'])
        const graphOutLoading = _.get(state, ['statFinance', 'dataOut', 'loading'])
        const list = _.get(state, ['statFinance', 'list', 'data'])
        const listLoading = _.get(state, ['statFinance', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const categoryPopopData = _.get(state, ['transaction', 'categoryPopopData', 'data'])
        const categoryPopopDataLoading = _.get(state, ['transaction', 'categoryPopopData', 'loading'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            list,
            listLoading,
            graphIn,
            graphOut,
            graphInLoading,
            graphOutLoading,
            filter,
            filterForm,
            categoryPopopData,
            categoryPopopDataLoading
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statFinanceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null
        }
        return (props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except))
    }, ({dispatch, filter}) => {
        dispatch(statFinanceInDataFetchAction(filter))
        dispatch(statFinanceOutDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevCategoryPopop = _.toNumber(_.get(props, ['location', 'query', TRANSACTION_CATEGORY_POPOP_OPEN]))
        const nextCategoryPopop = _.toNumber(_.get(nextProps, ['location', 'query', TRANSACTION_CATEGORY_POPOP_OPEN]))
        return prevCategoryPopop !== nextCategoryPopop && nextCategoryPopop > ZERO
    }, ({dispatch, location}) => {
        const id = _.toInteger(_.get(location, ['query', TRANSACTION_CATEGORY_POPOP_OPEN]))
        id && dispatch(transactionCategoryPopopDataAction(id))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense']) || null

            filter.filterBy({
                [STAT_FINANCE_FILTER_KEY.SEARCH]: search,
                [STAT_FINANCE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_FINANCE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_FINANCE_FILTER_KEY.TYPE]: joinArray(type),
                [STAT_FINANCE_FILTER_KEY.CLIENT]: joinArray(client),
                [STAT_FINANCE_FILTER_KEY.CATEGORY_EXPENSE]: joinArray(categoryExpense)
            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_FINANCE_GET_DOCUMENT, params)
        },
        handleOpenCategoryPopop: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname: pathname, query: filter.getParams({[TRANSACTION_CATEGORY_POPOP_OPEN]: id})})
        },

        handleCloseCategoryPopop: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TRANSACTION_CATEGORY_POPOP_OPEN]: false})})
        }
    })
)

const StatFinanceList = enhance((props) => {
    const {
        list,
        listLoading,
        filter,
        layout,
        graphIn,
        graphOut,
        graphInLoading,
        graphOutLoading,
        location,
        categoryPopopData,
        categoryPopopDataLoading
    } = props
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const type = !_.isNull(_.get(location, ['query', 'type'])) && _.get(location, ['query', 'type'])
    const client = !_.isNull(_.get(location, ['query', 'client'])) && _.get(location, ['query', 'client'])
    const categoryExpense = !_.isNull(_.get(location, ['query', 'categoryExpense'])) && _.get(location, ['query', 'categoryExpense'])
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null
    const openCategoryPopop = _.toNumber(_.get(location, ['query', TRANSACTION_CATEGORY_POPOP_OPEN]))

    const graphData = {
        dataIn: graphIn,
        dataOut: graphOut,
        graphOutLoading,
        graphInLoading
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const categoryPopUp = {
        data: _.get(categoryPopopData, 'results'),
        loading: categoryPopopDataLoading,
        open: openCategoryPopop > ZERO,
        handleOpen: props.handleOpenCategoryPopop,
        handleClose: props.handleCloseCategoryPopop
    }
    const filterForm = {
        initialValues: {
            search: search,
            type: type && splitToArray(type),
            client: client && splitToArray(client),
            categoryExpense: categoryExpense && splitToArray(categoryExpense),
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatFinanceGridList
                filter={filter}
                listData={listData}
                graphData={graphData}
                getDocument={getDocument}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                categoryPopUp={categoryPopUp}

            />
        </Layout>
    )
})

export default StatFinanceList
