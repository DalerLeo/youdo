import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {
    StatIncomeGridList,
    STAT_INCOME_DIALOG_OPEN
} from '../../components/Statistics'
import {STAT_INCOME_FILTER_KEY} from '../../components/Statistics/StatIncomeGridList'
import {
    statIncomeListFetchAction,
    statIncomeDataFetchAction
} from '../../actions/statIncome'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detailLoading = _.get(state, ['statIncome', 'item', 'loading'])
        const grafData = _.get(state, ['statIncome', 'data', 'data'])
        const list = _.get(state, ['statIncome', 'list', 'data'])
        const listLoading = _.get(state, ['statIncome', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatIncomeFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            grafData,
            detailLoading,
            filter,
            query,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statIncomeListFetchAction(filter))
        dispatch(statIncomeDataFetchAction())
    }),

    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_INCOME_FILTER_KEY.SEARCH]: search,
                [STAT_INCOME_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_INCOME_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        }
    })
)

const StatIncomeList = enhance((props) => {
    const {
        location,
        list,
        grafData,
        listLoading,
        filter,
        layout
    } = props

    const openStatIncomeDialog = toBoolean(_.get(location, ['query', STAT_INCOME_DIALOG_OPEN]))
    const statIncomeDialog = {
        openStatIncomeDialog,
        handleCloseStatIncomeDialog: props.handleCloseStatIncomeDialog,
        handleOpenStatIncomeDialog: props.handleOpenStatIncomeDialog
    }
    const listData = {
        grafData: grafData,
        data: _.get(list, 'results'),
        listLoading
    }

    return (
        <Layout {...layout}>
            <StatIncomeGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                statIncomeDialog={statIncomeDialog}
            />
        </Layout>
    )
})

export default StatIncomeList
