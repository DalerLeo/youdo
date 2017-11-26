import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange} from 'recompose'
import Layout from '../../components/Layout'
import DashboardWrapper from '../../components/Dashboard'
import WelcomeERP from '../../components/Dashboard/WelcomeERP'
import {connect} from 'react-redux'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    statSalesDataFetchAction,
    statSalesReturnDataFetchAction,
    statAgentDataFetchAction,
    statFinanceIncomeFetchAction,
    statFinanceExpenseFetchAction
} from '../../actions/dashboard'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const orderList = _.get(state, ['statSales', 'data', 'data'])
        const orderLoading = _.get(state, ['statSales', 'data', 'loading'])
        const returnList = _.get(state, ['statSales', 'returnList', 'data'])
        const returnLoading = _.get(state, ['statSales', 'returnList', 'loading'])
        const agentsData = _.get(state, ['statAgent', 'list', 'data'])
        const agentsDataLoading = _.get(state, ['statAgent', 'list', 'loading'])
        const financeIncome = _.get(state, ['statFinance', 'dataIn', 'data'])
        const financeExpense = _.get(state, ['statFinance', 'dataOut', 'data'])
        const financeDataLoading = _.get(state, ['statFinance', 'dataIn', 'loading']) || _.get(state, ['statFinance', 'dataOut', 'loading'])
        const userName = _.get(state, ['authConfirm', 'data', 'firstName']) + ' ' + _.get(state, ['authConfirm', 'data', 'secondName'])
        const userPosition = _.get(state, ['authConfirm', 'data', 'position', 'name'])
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const filter = filterHelper(orderList, pathname, query)
        return {
            orderList,
            orderLoading,
            returnList,
            returnLoading,
            agentsData,
            agentsDataLoading,
            financeIncome,
            financeExpense,
            financeDataLoading,
            userName,
            userPosition,
            isAdmin,
            filter
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.orderList && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statSalesDataFetchAction(filter))
        dispatch(statSalesReturnDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return props.agentsData && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statAgentDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.financeIncome || props.financeExpense) && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statFinanceIncomeFetchAction(filter))
        dispatch(statFinanceExpenseFetchAction(filter))
    }),
)

const MainList = enhance((props) => {
    const {
        layout,
        location,
        orderList,
        orderLoading,
        returnList,
        returnLoading,
        agentsData,
        agentsDataLoading,
        financeIncome,
        financeExpense,
        financeDataLoading,
        userName,
        userPosition,
        isAdmin,
        filter
    } = props

    const mergeFinanceData = (firstData, secondData) => {
        const financeData = {}
        if (!financeDataLoading) {
            _.map(firstData, (item) => {
                financeData[_.get(item, 'date')] = {
                    in: _.toNumber(_.get(item, 'amount'))
                }
            })
            _.map(secondData, (item) => {
                if (financeData[_.get(item, 'date')]) {
                    financeData[_.get(item, 'date')] = {
                        in: _.toNumber(financeData[_.get(item, 'date')].in),
                        out: Math.abs(_.toNumber(_.get(item, 'amount')))
                    }
                } else {
                    financeData[_.get(item, 'date')] = {
                        in: null,
                        out: Math.abs(_.toNumber(_.get(item, 'amount')))
                    }
                }
            })
        }
        return financeData
    }

    const mergeOrdersReturns = (firstData, secondData) => {
        const ordersData = {}
        if (!orderLoading && !returnLoading) {
            _.map(firstData, (item) => {
                ordersData[_.get(item, 'date')] = {
                    orders: _.toNumber(_.get(item, 'amount'))
                }
            })
            _.map(secondData, (item) => {
                if (ordersData[_.get(item, 'date')]) {
                    ordersData[_.get(item, 'date')] = {
                        orders: _.toNumber(ordersData[_.get(item, 'date')].orders),
                        returns: _.toNumber(_.get(item, 'totalAmount'))
                    }
                } else {
                    ordersData[_.get(item, 'date')] = {
                        orders: null,
                        returns: _.toNumber(_.get(item, 'totalAmount'))
                    }
                }
            })
        }
        return ordersData
    }

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

    const ordersReturnsChart = {
        data: mergeOrdersReturns(orderList, returnList),
        loading: orderLoading || returnLoading
    }

    const agentsChart = {
        data: _.get(agentsData, 'results'),
        loading: agentsDataLoading
    }

    const financeChart = {
        data: mergeFinanceData(financeIncome, financeExpense),
        loading: financeDataLoading
    }

    const dateInitialValues = {
        dateRange: {
            startDate: moment(beginDate),
            endDate: moment(endDate)
        }
    }

    return (
        <Layout {...layout}>
            {isAdmin
            ? <DashboardWrapper
                    filter={filter}
                    orderChart={orderChart}
                    ordersReturnsChart={ordersReturnsChart}
                    agentsChart={agentsChart}
                    financeChart={financeChart}
                    userData={userData}
                    dateInitialValues={dateInitialValues}
                />
            : <WelcomeERP/>}
        </Layout>
    )
})

export default MainList
