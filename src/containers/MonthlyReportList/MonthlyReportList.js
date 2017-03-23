import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import MonthlyReportListTable from '../../components/MonthlyReportListTable'
import {monthlyReportListFetchAction, monthlyReportCSVFetchAction} from '../../actions/monthly'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['monthlyReport', 'list', 'data'])
        const loading = _.get(state, ['monthlyReport', 'list', 'loading'])
        const csvData = _.get(state, ['monthlyReport', 'csv', 'data'])
        const csvLoading = _.get(state, ['monthlyReport', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'MonthlyReportFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            loading,
            csvData,
            csvLoading,
            filter,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.createURL() !== nextProps.filter.createURL()
    }, ({dispatch, filter}) => {
        dispatch(monthlyReportListFetchAction(filter))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(monthlyReportCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openFilterDialog: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openFilterDialog: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const year = _.get(filterForm, ['values', 'year']) || null
            const month = _.get(filterForm, ['values', 'month']) || null
            const account = _.get(filterForm, ['values', 'account', 'id'])
            const client = _.get(filterForm, ['values', 'client', 'id'])
            const broker = _.get(filterForm, ['values', 'broker', 'id'])
            const fundManager = _.get(filterForm, ['values', 'fundManager', 'id'])
            filter.filterBy({
                openFilterDialog: false,
                account,
                client,
                broker,
                fundManager,
                year,
                month
            })
        }
    })
)

const MonthlyReportList = enhance((props) => {
    const {list, loading, filter, layout, location} = props

    const openFilterDialog = toBoolean(_.get(location, ['query', 'openFilterDialog']))
    const year = filter.getParam('year')
    const month = filter.getParam('month')
    const initialValues = {
        month: month && parseInt(month),
        year: year && parseInt(year)
    }
    const filterDialog = {
        initialValues,
        filterLoading: loading,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }
    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
    }

    return (
        <Layout {...layout}>
            <MonthlyReportListTable
                filter={filter}
                loading={loading}
                data={_.get(list, 'results')}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default MonthlyReportList
