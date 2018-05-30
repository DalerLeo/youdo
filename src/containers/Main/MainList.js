import _ from 'lodash'
import React from 'react'
import {
  compose,
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

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const orderList = _.get(state, ['statSales', 'data', 'data'])
    const orderLoading = !_.isArray(orderList) ? true : _.get(state, ['statSales', 'data', 'loading'])
    const returnList = _.get(state, ['statSales', 'returnList', 'data'])
    const returnLoading = !_.isArray(returnList) ? true : _.get(state, ['statSales', 'returnList', 'loading'])
    const agentsData = _.get(state, ['statAgent', 'list', 'data'])
    const agentsDataLoading = !_.isArray(_.get(agentsData, 'results')) ? true : _.get(state, ['statAgent', 'list', 'loading'])
    const financeIncome = _.get(state, ['statFinance', 'dataIn', 'data'])
    const financeExpense = _.get(state, ['statFinance', 'dataOut', 'data'])
    const financeDataLoading = !_.isArray(financeIncome) || !_.isArray(financeExpense)
      ? true
      : _.get(state, ['statFinance', 'dataIn', 'loading']) || _.get(state, ['statFinance', 'dataOut', 'loading'])
    const currencyList = _.get(state, ['currency', 'list', 'data'])
    const currencyListLoading = !_.isArray(_.get(currencyList, 'results')) ? true : _.get(state, ['currency', 'list', 'loading'])
    const userName = _.get(state, ['authConfirm', 'data', 'firstName']) + ' ' + _.get(state, ['authConfirm', 'data', 'secondName'])
    const userPosition = _.get(state, ['authConfirm', 'data', 'position', 'name'])
    const userPhoto = _.get(state, ['authConfirm', 'data', 'photo', 'file'])
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
      userPhoto,
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

  withHandlers({
    handleUpdateRate: () => () => {
      return Promise.resolve()
    },

    handleChangePassword: props => () => {
      return null
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
    userPhoto,
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
    position: userPosition,
    photo: userPhoto
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
