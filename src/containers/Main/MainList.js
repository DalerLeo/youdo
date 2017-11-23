import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange} from 'recompose'
import Layout from '../../components/Layout'
import DashboardWrapper from '../../components/Dashboard'
import {connect} from 'react-redux'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    statSalesDataFetchAction,
    statAgentDataFetchAction
} from '../../actions/dashboard'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const orderList = _.get(state, ['statSales', 'data', 'data'])
        const orderLoading = _.get(state, ['statSales', 'data', 'loading'])
        const agentsData = _.get(state, ['statAgent', 'list', 'data'])
        const agentsDataLoading = _.get(state, ['statAgent', 'list', 'loading'])
        const userName = _.get(state, ['authConfirm', 'data', 'firstName']) + ' ' + _.get(state, ['authConfirm', 'data', 'secondName'])
        const userPosition = _.get(state, ['authConfirm', 'data', 'position', 'name'])
        const filter = filterHelper(orderList, pathname, query)
        return {
            orderList,
            orderLoading,
            agentsData,
            agentsDataLoading,
            userName,
            userPosition,
            filter
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.orderList && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statSalesDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return props.agentsData && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statAgentDataFetchAction(filter))
    }),
)

const MainList = enhance((props) => {
    const {
        layout,
        location,
        orderList,
        orderLoading,
        agentsData,
        agentsDataLoading,
        userName,
        userPosition,
        filter
    } = props

    const lastDayOfMonth = _.get(location, ['query', 'endDate'])
        ? moment(_.get(location, ['query', 'endDate'])).daysInMonth()
        : moment().daysInMonth()
    const beginDate = _.get(location, ['query', 'beginDate']) || moment().format('YYYY-MM-01')
    const endDate = _.get(location, ['query', 'endDate']) || moment().format('YYYY-MM-' + lastDayOfMonth)

    const userData = {
        username: userName,
        position: userPosition
    }
    const orderChart = {
        data: orderList,
        loading: orderLoading
    }

    const agentsChart = {
        data: _.get(agentsData, 'results'),
        loading: agentsDataLoading
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
                agentsChart={agentsChart}
                userData={userData}
                dateInitialValues={dateInitialValues}
            />
        </Layout>
    )
})

export default MainList
