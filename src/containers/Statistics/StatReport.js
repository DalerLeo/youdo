import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'

import {
    StatReportGridList
} from '../../components/Statistics'

import {STAT_REPORT_FILTER_KEY} from '../../components/Statistics/StatReportGridLIst'
import {
    statReportListFetchAction,
    statReportItemFetchAction
} from '../../actions/statReport'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statReport', 'item', 'data'])
        const detailLoading = _.get(state, ['statReport', 'item', 'loading'])
        const list = _.get(state, ['statReport', 'list', 'data'])
        const listLoading = _.get(state, ['statReport', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatReportFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            filterItem
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statReportListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statReportId = _.get(nextProps, ['params', 'statReportId']) || ZERO
        return statReportId > ZERO && (_.get(props, ['params', 'statReportId']) !== statReportId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem}) => {
        const statReportId = _.toInteger(_.get(params, 'statReportId'))
        if (statReportId > ZERO) {
            dispatch(statReportItemFetchAction(filterItem, statReportId))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_REPORT_FILTER_KEY.DIVISION]: division,
                [STAT_REPORT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_REPORT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        }
    })
)

const StatReportList = enhance((props) => {
    const {
        list,
        listLoading,
        filter,
        layout,
        filterItem
    } = props

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatReportGridList
                filter={filter}
                onSubmit={props.handleSubmitFilterDialog}
                listData={listData}
                getDocument={getDocument}
                filterItem={filterItem}
            />
        </Layout>
    )
})

export default StatReportList
