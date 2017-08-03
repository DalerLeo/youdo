import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {
    StatOutcomeGridList,
    STAT_OUTCOME_DIALOG_OPEN
} from '../../components/Statistics'
import {STAT_OUTCOME_FILTER_KEY} from '../../components/Statistics/StatOutcomeGridList'
import {
    statOutcomeListFetchAction,
    statOutcomeDataFetchAction,
    getDocumentAction
} from '../../actions/statOutcome'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detailLoading = _.get(state, ['statOutcome', 'item', 'loading'])
        const grafData = _.get(state, ['statOutcome', 'data', 'data'])
        const list = _.get(state, ['statOutcome', 'list', 'data'])
        const listLoading = _.get(state, ['statOutcome', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatOutcomeFilterForm'])
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
        dispatch(statOutcomeListFetchAction(filter))
        dispatch(statOutcomeDataFetchAction())
    }),

    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_OUTCOME_FILTER_KEY.SEARCH]: search,
                [STAT_OUTCOME_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_OUTCOME_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
        }
    })
)

const StatOutcomeList = enhance((props) => {
    const {
        location,
        list,
        grafData,
        listLoading,
        filter,
        layout
    } = props

    const openStatOutcomeDialog = toBoolean(_.get(location, ['query', STAT_OUTCOME_DIALOG_OPEN]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const statOutcomeDialog = {
        openStatOutcomeDialog,
        handleCloseStatOutcomeDialog: props.handleCloseStatOutcomeDialog,
        handleOpenStatOutcomeDialog: props.handleOpenStatOutcomeDialog
    }
    const listData = {
        grafData: grafData,
        data: _.get(list, 'results'),
        listLoading
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

    return (
        <Layout {...layout}>
            <StatOutcomeGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                statOutcomeDialog={statOutcomeDialog}
                getDocument={getDocument}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
            />
        </Layout>
    )
})

export default StatOutcomeList
