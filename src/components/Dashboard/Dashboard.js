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
import Filter from './Filter'
import Widgets from './Widgets'
import OrderChart from './OrderChart'
import AgentsChart from './AgentsChart'
import SalesReturnsChart from './SalesReturnsChart'

const enhance = compose(
    injectSheet({
        chartLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            '& > div': {
                width: 'calc(50% - 10px)',
                marginBottom: '20px',
                background: '#efefef',
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
        }
    })
)

const Dashboard = enhance((props) => {
    const {
        classes,
        userData,
        filter,
        orderChart,
        agentsChart,
        dateInitialValues
    } = props
    const ZERO = 0
    const MAX_OUTPUT = 10
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    // USER DATA //
    const username = _.get(userData, 'username')
    const position = _.get(userData, 'position')

    // ORDERS & RETURNS //
    const orderChartLoading = _.get(orderChart, 'loading')
    const orderChartDate = _.map(_.get(orderChart, 'data'), (item) => {
        return _.get(item, 'date')
    })
    const orderChartSales = _.map(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const orderChartReturns = _.map(_.get(orderChart, 'data'), (item) => {
        const returnAmount = _.get(item, 'returnAmount')
        return _.isNull(returnAmount) ? null : _.toNumber(returnAmount)
    })
    const orderChartSalesSum = _.sumBy(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const orderChartReturnsSum = _.sumBy(_.get(orderChart, 'data'), (item) => {
        return _.toNumber(_.get(item, 'returnAmount'))
    })

    // AGENTS //
    const sortedAgentsList = _.slice(_.filter(_.orderBy(_.get(agentsChart, 'data'), ['ordersTotalPrice'], ['desc']), (item) => {
        return !_.isNull(_.get(item, 'ordersTotalPrice'))
    }), ZERO, MAX_OUTPUT)
    const agentsChartLoading = _.get(agentsChart, 'loading')
    const agentsList = _.map(sortedAgentsList, item => {
        return _.get(item, 'name')
    })
    const agentsOrders = _.map(sortedAgentsList, item => {
        return _.toNumber(_.get(item, 'ordersTotalPrice'))
    })
    const agentsReturns = _.map(sortedAgentsList, item => {
        return _.toNumber(_.get(item, 'ordersReturnedTotalPrice'))
    })
    const agentsFact = _.map(sortedAgentsList, item => {
        return _.toNumber(_.get(item, 'factPrice'))
    })
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
                        <Filter filter={filter} initialValues={dateInitialValues}/>
                        <Widgets/>
                    </div>
                </Paper>

                <section className={classes.chartsWrapper}>
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
                                tooltipTitle={orderChartDate}
                            />}
                    </Paper>
                    <Paper zDepth={1}>
                        <div className={classes.chartHeader}>
                            <div>Заказы и возвраты</div>
                        </div>
                        <div className={classes.chartStats}>
                            <div>Продажи: {numberFormat(orderChartSalesSum, primaryCurrency)}</div>
                            <div>Возвраты: {numberFormat(orderChartReturnsSum, primaryCurrency)}</div>
                        </div>
                        {orderChartLoading
                            ? <div className={classes.chartLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <SalesReturnsChart
                                height={250}
                                primaryText="Продажа"
                                secondaryText="Возврат"
                                primaryValues={orderChartSales}
                                secondaryValues={orderChartReturns}
                                tooltipTitle={orderChartDate}
                            />}
                    </Paper>
                    <Paper zDepth={1} className={classes.fullWidth}>
                        <div className={classes.chartHeader}>
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
                    </Paper>
                </section>
            </div>
        </Container>
    )
})

export default Dashboard
