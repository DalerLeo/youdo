import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import {StatOutcomeCategoryGridList} from '../../components/Statistics'
import {STAT_OUTCOME_CATEGORY_FILTER_KEY} from '../../components/Statistics/Outcome/StatOutcomeCategoryGridList'
import {
    statOutcomeCategoryListFetchAction,
    statOutcomeCategoryItemFetchAction,
    getTransactionData,
    getDocumentAction
} from '../../actions/statOutcomeCategory'
import toBoolean from '../../helpers/toBoolean'

const ZERO = 0
const OPEN_TRANSACTION_DIALOG = 'openTransactionDialog'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statOutcomeCategory', 'item', 'data'])
        const detailLoading = _.get(state, ['statOutcomeCategory', 'item', 'loading'])
        const list = _.get(state, ['statOutcomeCategory', 'list', 'data'])
        const listLoading = _.get(state, ['statOutcomeCategory', 'list', 'loading'])
        const transactionData = _.get(state, ['statOutcomeCategory', 'transactionData', 'data'])
        const transactionDataLoading = _.get(state, ['statOutcomeCategory', 'transactionData', 'loading'])
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
            (!_.get(props, ['params', 'statOutcomeCategoryId'])) &&
            (!_.get(nextProps, ['params', 'statOutcomeCategoryId']))
    }, ({dispatch, filter}) => {
        dispatch(statOutcomeCategoryListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statOutcomeCategoryId = _.get(nextProps, ['params', 'statOutcomeCategoryId']) || ZERO
        return statOutcomeCategoryId > ZERO && _.get(props, ['params', 'statOutcomeCategoryId']) !== statOutcomeCategoryId
    }, ({dispatch, params, filter, filterItem}) => {
        const statOutcomeCategoryId = _.toInteger(_.get(params, 'statOutcomeCategoryId'))
        if (statOutcomeCategoryId > ZERO) {
            dispatch(statOutcomeCategoryItemFetchAction(filter, filterItem, statOutcomeCategoryId))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevOpen = toBoolean(_.get(props, ['location', 'query', 'openTransactionDialog']))
        const nextOpen = toBoolean(_.get(nextProps, ['location', 'query', 'openTransactionDialog']))
        return prevOpen !== nextOpen && nextOpen === true
    }, ({dispatch, filter, location}) => {
        const nextOpen = toBoolean(_.get(location, ['query', [OPEN_TRANSACTION_DIALOG]]))
        if (nextOpen) {
            dispatch(getTransactionData(filter))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_OUTCOME_CATEGORY_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_OUTCOME_CATEGORY_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
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

const StatOutcomeCategoryList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        filterForm,
        transactionData,
        transactionDataLoading,
        location,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statOutcomeCategoryId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const openTransactionDialog = toBoolean(_.get(location, ['query', [OPEN_TRANSACTION_DIALOG]]))

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
            <StatOutcomeCategoryGridList
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

export default StatOutcomeCategoryList
