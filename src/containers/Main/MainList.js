import _ from 'lodash'
import React from 'react'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import DashboardWrapper from '../../components/Dashboard'
import WelcomeERP from '../../components/Dashboard/WelcomeERP'
import {WIDGETS_FORM_KEY} from '../../components/Dashboard/Widgets'
import {connect} from 'react-redux'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
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
        const widgetsForm = _.get(state, ['form', 'DashboardWidgetsForm'])
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
            filter,
            widgetsForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            orders: null,
            agents: null,
            finance: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        const active = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.SALES)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.SALES))
        if (active) {
            dispatch(statSalesDataFetchAction(filter))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            sales: null,
            agents: null,
            finance: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        const active = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.ORDERS)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.ORDERS))
        if (active) {
            dispatch(statSalesReturnDataFetchAction(filter))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            sales: null,
            orders: null,
            finance: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        const active = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.AGENTS)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.AGENTS))
        if (active) {
            dispatch(statAgentDataFetchAction(filter))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            sales: null,
            orders: null,
            agents: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        const active = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.FINANCE)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.FINANCE))
        if (active) {
            dispatch(statFinanceIncomeFetchAction(filter))
            dispatch(statFinanceExpenseFetchAction(filter))
        }
    }),

    withHandlers({
        handleSubmitWidgetsForm: props => () => {
            const {filter, widgetsForm} = props
            const sales = _.get(widgetsForm, ['values', 'sales']) || null
            const orders = _.get(widgetsForm, ['values', 'orders']) || null
            const agents = _.get(widgetsForm, ['values', 'agents']) || null
            const finance = _.get(widgetsForm, ['values', 'finance']) || null

            filter.filterBy({
                [WIDGETS_FORM_KEY.SALES]: sales,
                [WIDGETS_FORM_KEY.ORDERS]: orders,
                [WIDGETS_FORM_KEY.AGENTS]: agents,
                [WIDGETS_FORM_KEY.FINANCE]: finance
            })
        }
    })
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

    const sales = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.SALES)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.SALES))
    const orders = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.ORDERS)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.ORDERS))
    const agents = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.AGENTS)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.AGENTS))
    const finance = _.isUndefined(filter.getParam(WIDGETS_FORM_KEY.FINANCE)) ? true : toBoolean(filter.getParam(WIDGETS_FORM_KEY.FINANCE))

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
        active: sales,
        data: orderList,
        loading: orderLoading
    }

    const ordersReturnsChart = {
        active: orders,
        data: mergeOrdersReturns(orderList, returnList),
        loading: orderLoading || returnLoading
    }

    const agentsChart = {
        active: agents,
        data: _.get(agentsData, 'results'),
        loading: agentsDataLoading
    }

    const financeChart = {
        active: finance,
        data: mergeFinanceData(financeIncome, financeExpense),
        loading: financeDataLoading
    }

    const dateInitialValues = {
        dateRange: {
            startDate: moment(beginDate),
            endDate: moment(endDate)
        }
    }

    const widgetsForm = {
        initialValues: {
            sales: sales,
            orders: orders,
            agents: agents,
            finance: finance
        },
        handleSubmitWidgetsForm: props.handleSubmitWidgetsForm
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
                    widgetsForm={widgetsForm}
                />
            : <WelcomeERP/>}
        </Layout>
    )
})

export default MainList
