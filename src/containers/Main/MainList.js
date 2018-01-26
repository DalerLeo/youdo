import _ from 'lodash'
import React from 'react'
import {
    compose,
    withPropsOnChange,
    withHandlers,
    withState,
    lifecycle
} from 'recompose'
import Layout from '../../components/Layout'
import DashboardWrapper from '../../components/Dashboard'
import {WIDGETS_FORM_KEY} from '../../components/Dashboard/Widgets'
import {connect} from 'react-redux'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import {
    statSalesDataFetchAction,
    statSalesReturnDataFetchAction,
    statAgentDataFetchAction,
    statFinanceIncomeFetchAction,
    statFinanceExpenseFetchAction,
    widgetsListFetchAction,
    changePasswordFetchAction
} from '../../actions/dashboard'
import {
    courseCreateAction,
    currencyListFetchAction
} from '../../actions/currency'
import {reset} from 'redux-form'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const orderList = _.get(state, ['statSales', 'data', 'data'])
        const orderLoading = !_.isArray(orderList) ? true : _.get(state, ['statSales', 'data', 'loading'])
        const returnList = _.get(state, ['statSales', 'returnList', 'data'])
        const returnLoading = !_.isArray(returnList) ? true : _.get(state, ['statSales', 'returnList', 'loading'])
        const agentsData = _.get(state, ['statAgent', 'list', 'data'])
        const agentsDataLoading = !_.isArray(agentsData.results) ? true : _.get(state, ['statAgent', 'list', 'loading'])
        const financeIncome = _.get(state, ['statFinance', 'dataIn', 'data'])
        const financeExpense = _.get(state, ['statFinance', 'dataOut', 'data'])
        const financeDataLoading = !_.isArray(financeIncome) || !_.isArray(financeExpense)
            ? true
            : _.get(state, ['statFinance', 'dataIn', 'loading']) || _.get(state, ['statFinance', 'dataOut', 'loading'])
        const currencyList = _.get(state, ['currency', 'list', 'data'])
        const currencyListLoading = !_.isArray(currencyList.results) ? true : _.get(state, ['currency', 'list', 'loading'])
        const userName = _.get(state, ['authConfirm', 'data', 'firstName']) + ' ' + _.get(state, ['authConfirm', 'data', 'secondName'])
        const userPosition = _.get(state, ['authConfirm', 'data', 'position', 'name'])
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const filter = filterHelper(orderList, pathname, query)
        const currencyForm = _.get(state, ['form', 'DashboardCurrencyForm'])
        const passwordForm = _.get(state, ['form', 'DashboardPasswordForm'])
        const widgetsList = _.get(state, ['widgets', 'list', 'data'])
        const widgetsLoading = _.get(state, ['widgets', 'list', 'loading'])
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
            currencyList,
            currencyListLoading,
            userName,
            userPosition,
            isAdmin,
            filter,
            currencyForm,
            widgetsList,
            widgetsLoading,
            passwordForm
        }
    }),

    withState('loading', 'setLoading', false),
    withState('openEditPass', 'setOpenEditPass', false),
    withPropsOnChange((props, nextProps) => {
        const except = {
            agents: null,
            currency: null,
            finance: null,
            orders: null,
            sales: null,
            page: null,
            beginDate: null,
            endDate: null
        }
        return props.widgetsList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch}) => {
        dispatch(widgetsListFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (props.widgetsLoading !== nextProps.widgetsLoading && nextProps.widgetsLoading === false)
    }, ({dispatch, filter, setLoading, widgetsList}) => {
        const widgetsKeynames = _.map(_.filter(_.get(widgetsList, 'results'), 'isActive'), item => _.get(item, 'keyName'))
        const activeSales = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.SALES)
        const activeOrders = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.ORDERS)
        const activeAgents = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.AGENTS)
        const activeFinance = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.FINANCE)
        const activeCurrency = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.CURRENCY)
        return (activeCurrency
            ? dispatch(currencyListFetchAction(filter))
            : Promise.resolve())
            .then(() => {
                return (activeSales
                    ? dispatch(statSalesDataFetchAction(filter))
                    : Promise.resolve())
                    .then(() => {
                        return (activeOrders
                            ? dispatch(statSalesReturnDataFetchAction(filter))
                                .then(() => {
                                    dispatch(statSalesDataFetchAction(filter))
                                })
                            : Promise.resolve())
                            .then(() => {
                                return (activeAgents
                                    ? dispatch(statAgentDataFetchAction(filter))
                                    : Promise.resolve())
                                    .then(() => {
                                        return (activeFinance
                                            ? dispatch(statFinanceIncomeFetchAction(filter))
                                                .then(() => {
                                                    dispatch(statFinanceExpenseFetchAction(filter))
                                                })
                                            : Promise.resolve())
                                            .then(() => {
                                                setLoading(false)
                                            })
                                    })
                            })
                    })
            })
    }),

    withHandlers({
        handleUpdateRate: props => (currency) => {
            const {dispatch, currencyForm, filter} = props
            const rate = _.get(currencyForm, ['values', 'rate'])
            return rate
                ? dispatch(courseCreateAction(_.get(currencyForm, ['values']), currency))
                    .then(() => {
                        return dispatch(openSnackbarAction({message: t('Курс обновлен')}))
                    })
                    .then(() => {
                        dispatch(currencyListFetchAction(filter))
                        dispatch(reset('DashboardCurrencyForm'))
                    })
                : Promise.resolve()
        },

        handleChangePassword: props => () => {
            const {dispatch, passwordForm, setOpenEditPass} = props
            return dispatch(changePasswordFetchAction(_.get(passwordForm, ['values'])))
                .then(() => {
                    setOpenEditPass(false)
                    return dispatch(openSnackbarAction({message: 'Пароль успешно изменен'}))
                })
        }
    }),

    lifecycle({
        componentWillMount () {
            const setLoading = _.get(this, ['props', 'setLoading'])
            setLoading(true)
        },
        componentWillReceiveProps (props) {
            const setLoading = _.get(props, 'setLoading')
            if ((this.props.filter.filterRequest() !== props.filter.filterRequest()) ||
                (this.props.widgetsLoading !== props.widgetsLoading && props.widgetsLoading === false)) {
                setLoading(true)
            }
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
        currencyList,
        currencyListLoading,
        userName,
        userPosition,
        isAdmin,
        filter,
        loading,
        dispatch,
        widgetsList,
        widgetsLoading,
        openEditPass,
        setOpenEditPass
    } = props

    const widgetsKeynames = _.map(_.filter(_.get(widgetsList, 'results'), 'isActive'), item => _.get(item, 'keyName'))

    const sales = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.SALES)
    const orders = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.ORDERS)
    const agents = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.AGENTS)
    const finance = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.FINANCE)
    const currency = _.includes(widgetsKeynames, WIDGETS_FORM_KEY.CURRENCY)

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
        data: returnList,
        loading: returnLoading
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

    const currencyData = {
        active: currency,
        data: _.get(currencyList, 'results'),
        loading: currencyListLoading,
        handleUpdateRate: props.handleUpdateRate
    }

    const dateInitialValues = {
        dateRange: {
            startDate: moment(beginDate),
            endDate: moment(endDate)
        }
    }

    const widgetsForm = {
        list: _.get(widgetsList, 'results'),
        loading: widgetsLoading,
        initialValues: (() => {
            const object = {}
            _.map(_.get(widgetsList, 'results'), (item) => {
                const keyName = _.get(item, 'keyName')
                object[keyName] = _.get(item, 'isActive')
            })
            return object
        })()
    }

    return (
        <Layout {...layout}>
            <DashboardWrapper
                isAdmin={isAdmin}
                filter={filter}
                orderChart={orderChart}
                ordersReturnsChart={ordersReturnsChart}
                agentsChart={agentsChart}
                financeChart={financeChart}
                currencyData={currencyData}
                userData={userData}
                dateInitialValues={dateInitialValues}
                widgetsForm={widgetsForm}
                loading={loading}
                dispatch={dispatch}
                openEditPass={openEditPass}
                setOpenEditPass={setOpenEditPass}
                handleChangePassword={props.handleChangePassword}
            />
        </Layout>
    )
})

export default MainList
