import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {StatReportGridList} from '../../components/Statistics'
import {STAT_REPORT_FILTER_KEY} from '../../components/Statistics/StatReportGridLIst'
import {statReportListFetchAction} from '../../actions/statReport'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['statReport', 'list', 'data'])
        const listLoading = _.get(state, ['statReport', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            filter,
            query,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statReportListFetchAction(filter))
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
        location,
        list,
        listLoading,
        filter,
        layout,
        filterItem
    } = props

    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: list || {},
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
    return (
        <Layout {...layout}>
            <StatReportGridList
                filter={filter}
                onSubmit={props.handleSubmitFilterDialog}
                listData={listData}
                getDocument={getDocument}
                filterItem={filterItem}
                initialValues={initialValues}
            />
        </Layout>
    )
})

export default StatReportList
