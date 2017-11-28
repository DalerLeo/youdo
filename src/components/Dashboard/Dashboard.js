import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import Container from '../Container'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import User from '../Images/person.png'
import NoWidgets from '../Images/choose-menu.png'
import Filter from './Filter'
import Widgets from './Widgets'
import OrderChart from './OrderChart'
import AgentsChart from './AgentsChart'
import FinanceChart from './FinanceChart'
import SalesReturnsChart from './SalesReturnsChart'

const enhance = compose(
    injectSheet({
        chartLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'
        },
        borderBottom: {
            borderBottom: '1px #efefef solid'
        },
        wrapper: {
            position: 'absolute',
            left: '-28px',
            right: '-28px',
            top: '0',
            bottom: '-28px',
            padding: '20px 30px',
            overflowY: 'auto'
        },
        header: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxHeight: '70px'
        },
        user: {
            display: 'flex',
            alignItems: 'center',
            '& div': {
                marginRight: '10px',
                fontSize: '16px',
                fontWeight: '600'
            },
            '& span': {
                color: '#999',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '-5px'
            }
        },
        userImage: {
            background: 'url(' + User + ') no-repeat center center',
            backgroundSize: 'cover',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        },
        chartsWrapper: {
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            '& > div': {
                marginBottom: '20px',
                width: 'calc(50% - 10px)',
                '& > div:last-child': {
                    padding: '20px 30px'
                }
            }
        },
        fullWidth: {
            width: '100% !important'
        },
        chartHeader: {
            padding: '15px 30px',
            fontWeight: '600'
        },
        chartStats: {
            display: 'flex',
            padding: '15px 30px',
            background: '#f2f5f8',
            '& > div': {
                marginRight: '20px'
            }
        },
        emptyWidgets: {
            background: 'url(' + NoWidgets + ') no-repeat center 20px',
            backgroundSize: '170px',
            borderRadius: '2px',
            padding: '190px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        }
    })
)

const Dashboard = enhance((props) => {
    const {
        classes,
        userData,
        filter,
        orderChart,
        ordersReturnsChart,
        agentsChart,
        financeChart,
        dateInitialValues,
        widgetsForm
    } = props
    const ZERO = 0
    const MAX_OUTPUT = 10
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    // USER DATA //
    const username = _.get(userData, 'username')
    const position = _.get(userData, 'position')

    // SALES //
    const orderChartActive = _.get(orderChart, 'active')
    const orderChartLoading = _.get(orderChart, 'loading')
    const orderChartDate = _.map(_.get(orderChart, 'data'), (item) => {
        return _.get(item, 'date')
    })
    const orderChartSales = _.map(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const orderChartSalesSum = _.sumBy(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })

    // ORDERS & RETURNS //
    const orderReturnActive = _.get(ordersReturnsChart, 'active')
    const orderReturnLoading = _.get(ordersReturnsChart, 'loading')
    const orderChartReturns = _.map(_.get(ordersReturnsChart, 'data'), (item) => {
        return _.get(item, 'returns') || null
    })
    const orderReturnDate = _.map(_.get(ordersReturnsChart, 'data'), (item, index) => {
        return index
    })
    const orderChartReturnsSum = _.sumBy(_.get(ordersReturnsChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'returns'))
    })

    // AGENTS //
    const agentsChartActive = _.get(agentsChart, 'active')
    const agentsChartLoading = _.get(agentsChart, 'loading')
    const sortedAgentsList = _.slice(_.filter(_.orderBy(_.get(agentsChart, 'data'), ['ordersTotalPrice'], ['desc']), (item) => {
        return !_.isNull(_.get(item, 'ordersTotalPrice'))
    }), ZERO, MAX_OUTPUT)
    const agentsList = _.map(sortedAgentsList, item => {
        return _.get(item, 'name')
    })
    const agentsOrders = _.map(sortedAgentsList, item => {
        return _.get(item, 'ordersTotalPrice') || ZERO
    })
    const agentsReturns = _.map(sortedAgentsList, item => {
        return _.get(item, 'ordersReturnedTotalPrice') || ZERO
    })
    const agentsFact = _.map(sortedAgentsList, item => {
        return _.get(item, 'factPrice') || ZERO
    })

    // FINANCE //
    const financeChartActive = _.get(financeChart, 'active')
    const financeChartLoading = _.get(financeChart, 'loading')
    const financeDate = _.map(_.get(financeChart, 'data'), (item, index) => {
        return index
    })
    const financeIncome = _.map(_.get(financeChart, 'data'), (item) => {
        return _.get(item, 'in') || null
    })
    const financeExpense = _.map(_.get(financeChart, 'data'), (item) => {
        return _.get(item, 'out') || null
    })
    const financeIncomeSum = _.sumBy(financeIncome, (item) => {
        return item
    })
    const financeExpenseSum = _.sumBy(financeExpense, (item) => {
        return item
    })

    const noWidgets = !orderChartActive && !orderReturnActive && !agentsChartActive && !financeChartActive
    return (
        <Container>
            <div className={classes.wrapper}>
                <Paper zDepth={1} className={classes.header}>
                    <div className={classes.user}>
                        <div className={classes.userImage}>{null}</div>
                        <div>{username}</div>
                        <span>({position})</span>
                    </div>
                    <div className={classes.buttons}>
                        <Filter
                            filter={filter}
                            initialValues={dateInitialValues}/>
                        <Widgets
                            submitForm={widgetsForm.handleSubmitWidgetsForm}
                            initialValues={widgetsForm.initialValues}/>
                    </div>
                </Paper>

                <section className={classes.chartsWrapper}>
                    {orderChartActive &&
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader}>
                            <div>Продажи</div>
                        </div>
                        <div className={classes.chartStats}>
                            <div>Нал: {numberFormat(orderChartSalesSum, primaryCurrency)}</div>
                            <div>Пер: {numberFormat(orderChartSalesSum, primaryCurrency)}</div>
                            <div>Сумма: {numberFormat(orderChartSalesSum, primaryCurrency)}</div>
                        </div>
                        {orderChartLoading
                            ? <div className={classes.chartLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <OrderChart
                                height={250}
                                primaryText="Нал"
                                secondaryText="Переч"
                                primaryValues={orderChartSales}
                                secondaryValues={orderChartSales}
                                tooltipTitle={orderChartDate}
                            />}
                    </Paper>}
                    {orderReturnActive &&
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader}>
                            <div>Заказы и возвраты</div>
                        </div>
                        <div className={classes.chartStats}>
                            <div>Продажи: {numberFormat(orderChartSalesSum, primaryCurrency)}</div>
                            <div>Возвраты: {numberFormat(orderChartReturnsSum, primaryCurrency)}</div>
                        </div>
                        {orderReturnLoading
                            ? <div className={classes.chartLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <SalesReturnsChart
                                height={250}
                                primaryText="Продажа"
                                secondaryText="Возврат"
                                primaryValues={orderChartSales}
                                secondaryValues={orderChartReturns}
                                tooltipTitle={orderReturnDate}
                            />}
                    </Paper>}
                    {agentsChartActive &&
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader + ' ' + classes.borderBottom}>
                            <div>Статистика по агентам</div>
                        </div>
                        {agentsChartLoading
                            ? <div className={classes.chartLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <AgentsChart
                                agentsList={agentsList}
                                ordersData={agentsOrders}
                                returnsData={agentsReturns}
                                factsData={agentsFact}
                            />}
                    </Paper>}
                    {financeChartActive &&
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader}>
                            <div>Оборот</div>
                        </div>
                        <div className={classes.chartStats}>
                            <div>Приход: {numberFormat(financeIncomeSum, primaryCurrency)}</div>
                            <div>Расход: {numberFormat(financeExpenseSum, primaryCurrency)}</div>
                        </div>
                        {financeChartLoading
                            ? <div className={classes.chartLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <FinanceChart
                                primaryValues={financeIncome}
                                secondaryValues={financeExpense}
                                tooltipTitle={financeDate}
                                height={230}
                                primaryText="Приход"
                                secondaryText="Расход"
                            />}
                    </Paper>}
                </section>

                {noWidgets &&
                <div className={classes.emptyWidgets}>
                    <div>Виджеты отключены, <br/> включите, чтобы просмотреть статистику</div>
                </div>}
            </div>
        </Container>
    )
})

export default Dashboard
