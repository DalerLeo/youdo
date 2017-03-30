import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import ShopListTable from '../../components/ShopListTable'
import {shopListFetchAction, shopCSVFetchAction} from '../../actions/shop'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['shop', 'list', 'data'])
        const loading = _.get(state, ['shop', 'list', 'loading'])
        const csvData = _.get(state, ['shop', 'csv', 'data'])
        const csvLoading = _.get(state, ['shop', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'BalanceFilterForm'])
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
        dispatch(shopListFetchAction(filter))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(shopCSVFetchAction(props.filter))
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
            const fromDate = _.get(filterForm, ['values', 'fromToDate', 'startDate']) || null
            const toDate = _.get(filterForm, ['values', 'fromToDate', 'endDate']) || null
            const client = _.get(filterForm, ['values', 'client', 'id'])

            filter.filterBy({
                openFilterDialog: false,
                client,
                fromDate: fromDate && fromDate.format('YYYY-MM-DD'),
                toDate: toDate && toDate.format('YYYY-MM-DD')
            })
        }
    })
)

const ShopList = enhance((props) => {
    const {list, location, loading, filter, layout, params} = props

    const openFilterDialog = toBoolean(_.get(location, ['query', 'openFilterDialog']))
    const fromDate = filter.getParam('fromDate')
    const toDate = filter.getParam('toDate')
    const detailId = parseInt(_.get(params, 'shopId') || 0)
    const initialValues = {
        fromToDate: {
            startDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
            endDate: toDate && moment(toDate, 'YYYY-MM-DD')
        }
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
            <ShopListTable
                filter={filter}
                loading={loading}
                detailId={detailId}
                list={_.get(list, 'results')}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ShopList
