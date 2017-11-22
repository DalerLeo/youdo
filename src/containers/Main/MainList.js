import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange} from 'recompose'
import Layout from '../../components/Layout'
import DashboardWrapper from '../../components/Dashboard'
import {connect} from 'react-redux'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    statSalesDataFetchAction
} from '../../actions/dashboard'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const graphList = _.get(state, ['statSales', 'data', 'data'])
        const graphLoading = _.get(state, ['statSales', 'data', 'loading'])
        const filter = filterHelper(graphList, pathname, query)
        return {
            graphList,
            graphLoading,
            filter
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.graphList && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statSalesDataFetchAction(filter))
    }),
)

const MainList = enhance((props) => {
    const {
        layout,
        location,
        graphList,
        graphLoading,
        filter
    } = props

    const beginDate = _.get(location, ['query', 'beginDate']) || moment().format('YYYY-MM-DD')
    const endDate = _.get(location, ['query', 'endDate']) || moment().format('YYYY-MM-DD')

    const orderChart = {
        data: graphList,
        loading: graphLoading
    }

    const dateInitialValues = {
        dateRange: {
            startDate: moment(beginDate),
            endDate: moment(endDate)
        }
    }

    return (
        <Layout {...layout}>
            <DashboardWrapper
                filter={filter}
                orderChart={orderChart}
                dateInitialValues={dateInitialValues}
            />
        </Layout>
    )
})

export default MainList
