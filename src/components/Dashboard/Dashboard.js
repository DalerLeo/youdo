import _ from 'lodash'
import React from 'react'
import {compose, lifecycle, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import Container from '../Container'
import Loader from '../Loader'
import ToolTip from '../ToolTip'
import Paper from 'material-ui/Paper'
import User from '../Images/person.png'
import NoWidgets from '../Images/choose-menu.png'
import NoData from '../Images/not-found.png'
import Filter from './Filter'
import Widgets from './Widgets'
import OrderChart from './OrderChart'
import AgentsChart from './AgentsChart'
import FinanceChart from './FinanceChart'
import Currencies from './Currencies'
import Password from './Password'
import SalesReturnsChart from './SalesReturnsChart'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Language from 'material-ui/svg-icons/social/public'
import {setLanguage, getLanguage} from '../../helpers/storage'

import {SHOP_LIST} from '../../constants/actionTypes'
import t from '../../helpers/translate'

const refreshAction = () => {
    return {
        type: SHOP_LIST,
        payload: Promise.resolve({})
    }
}

const enhance = compose(
    injectSheet({
        chartLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
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
        languageWrapper: {
            position: 'fixed',
            bottom: '20px',
            right: '34px',
            zIndex: '2',
            '&:hover > div:first-child': {
                opacity: '0.9',
                visibility: 'visible'
            },
            '& button': {
                width: '52px !important',
                height: '52px !important',
                '& svg': {
                    height: '52px !important'
                }
            }
        },
        fabToolTip: {
            borderRadius: '2px',
            background: '#2d3037',
            color: '#fff',
            padding: '8px 21px',
            opacity: '0',
            visibility: 'hidden',
            position: 'absolute',
            right: '100%',
            top: '50%',
            lineHeight: '1.3',
            marginRight: '10px',
            transition: 'opacity 0.3s ease-out',
            transform: 'translate(0, -50%)',
            whiteSpace: 'nowrap'
        },
        header: {
            padding: '0 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px'
        },
        user: {
            display: 'flex',
            alignItems: 'center',
            '& h4': {
                marginLeft: '10px',
                marginRight: '10px',
                fontSize: '16px',
                fontWeight: '600'
            },
            '& span': {
                color: '#999',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '-5px',
                marginRight: '10px'
            },
            '& svg': {
                cursor: 'pointer',
                width: '20px !important',
                height: '20px !important'
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
            justifyContent: 'space-between'
        },
        chartHalf: {
            width: 'calc(50% - 10px)',
            flexWrap: 'wrap',
            '& > div': {
                marginBottom: '20px',
                minWidth: 'calc(50% - 10px)',
                width: '100%'
            }
        },
        chart: {
            '& > div:last-child': {
                padding: '20px 30px'
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
            flexWrap: 'wrap',
            padding: '15px 30px',
            background: '#f2f5f8',
            '& > div': {
                marginRight: '20px',
                '&:last-child': {
                    marginRight: '0'
                }
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
        },
        noData: {
            extend: 'emptyWidgets',
            borderTop: '1px #efefef solid',
            background: 'url(' + NoData + ') no-repeat center 20px',
            padding: '145px 0 20px !important'
        }
    }),
    withHandlers({
        setLangAction: props => (lang) => {
            setLanguage(lang, true)
            return props.dispatch(refreshAction())
        }
    }),
    lifecycle({
        componentWillReceiveProps () {
            const wrapper = this.refs.wrapper
            const firstChild = wrapper.firstChild
            const lastChild = wrapper.lastChild
            _.map(wrapper.childNodes, (half) => {
                _.map(half.childNodes, (chart) => {
                    chart.style.width = '100%'
                })
            })
            const style = 'width: 100%; display: flex; justify-content: space-between'
            firstChild.style.cssText = ''
            lastChild.style.cssText = ''
            if (_.isEmpty(firstChild.childNodes)) {
                _.map(lastChild.childNodes, (div) => {
                    div.style.width = 'calc(50% - 10px)'
                })
                lastChild.style.cssText = style
            } else if (_.isEmpty(lastChild.childNodes)) {
                _.map(firstChild.childNodes, (div) => {
                    div.style.width = 'calc(50% - 10px)'
                })
                firstChild.style.cssText = style
            }
        }
    })
)

const Dashboard = enhance((props) => {
    const {
        isAdmin,
        classes,
        userData,
        filter,
        orderChart,
        ordersReturnsChart,
        agentsChart,
        financeChart,
        currencyData,
        dateInitialValues,
        widgetsForm,
        loading,
        openEditPass,
        setOpenEditPass,
        handleChangePassword
    } = props
    const ZERO = 0
    const FLOOR = 2
    const MAX_OUTPUT = 10
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    // USER DATA //
    const username = _.get(userData, 'username')
    const position = _.get(userData, 'position') || 'Без должности'

    // SALES //
    const orderChartActive = _.get(orderChart, 'active')
    const orderChartLoading = _.get(orderChart, 'loading')
    const orderChartGroupByDate = _.map(_.groupBy(orderChart.data, 'date'), (item, index) => {
        const bankSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'amountBank')))
        const cashSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'amountCash')))
        const returnSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'returnAmount')))
        return {
            date: index,
            amountBank: bankSum,
            amountCash: cashSum,
            returnAmount: returnSum
        }
    })
    const orderChartDate = _.map(orderChartGroupByDate, (item) => _.get(item, 'date'))
    const orderChartSalesCash = _.map(orderChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'amountCash')), FLOOR)) || null
    const orderChartSalesBank = _.map(orderChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'amountBank')), FLOOR)) || null
    const orderChartSalesBankSum = _.sumBy(orderChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'amountBank')), FLOOR))
    const orderChartSalesCashSum = _.sumBy(orderChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'amountCash')), FLOOR))
    const orderChartSalesTotalSum = orderChartSalesCashSum + orderChartSalesBankSum

    // ORDERS & RETURNS //
    const ordersReturnsChartGroupByDate = _.map(_.groupBy(ordersReturnsChart.data, 'date'), (item, index) => {
        const bankSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'amountBank')))
        const cashSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'amountCash')))
        const returnSum = _.sumBy(item, (o) => _.toNumber(_.get(o, 'returnAmount')))
        return {
            date: index,
            amountBank: bankSum,
            amountCash: cashSum,
            returnAmount: returnSum
        }
    })
    const orderReturnActive = _.get(ordersReturnsChart, 'active')
    const orderReturnLoading = _.get(ordersReturnsChart, 'loading')
    const orderChartReturns = _.map(ordersReturnsChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'returnAmount')), FLOOR))
    const orderChartSales = _.map(ordersReturnsChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'amountCash')) + _.toNumber(_.get(item, 'amountBank')), FLOOR))
    const orderReturnDate = _.map(ordersReturnsChartGroupByDate, (item) => _.get(item, 'date'))
    const orderChartReturnsSum = _.sumBy(ordersReturnsChartGroupByDate, (item) => _.floor(_.toNumber(_.get(item, 'returnAmount')), FLOOR))
    const orderChartFactSum = orderChartSalesTotalSum - orderChartReturnsSum

    // AGENTS //
    const agentsChartActive = _.get(agentsChart, 'active')
    const agentsChartLoading = _.get(agentsChart, 'loading')
    const sortedAgentsList = _.slice(_.filter(_.orderBy(_.get(agentsChart, 'data'), ['salesTotal'], ['desc']), (item) => {
        return !_.isNull(_.get(item, 'salesTotal'))
    }), ZERO, MAX_OUTPUT)
    const agentsList = _.map(sortedAgentsList, item => _.get(item, 'name'))
    const agentsOrders = _.map(sortedAgentsList, item => _.floor(_.get(item, 'salesTotal'), FLOOR) || ZERO)
    const agentsReturns = _.map(sortedAgentsList, item => _.floor(_.get(item, 'returnTotal'), FLOOR) || ZERO)
    const agentsFact = _.map(sortedAgentsList, item => _.floor(_.get(item, 'salesFact'), FLOOR) || ZERO)

    // FINANCE //
    const financeChartActive = _.get(financeChart, 'active')
    const financeChartLoading = _.get(financeChart, 'loading')
    const financeDate = _.map(_.get(financeChart, 'data'), (item, index) => index)
    const financeIncome = _.map(_.get(financeChart, 'data'), (item) => _.floor(_.get(item, 'in'), FLOOR) || null)
    const financeExpense = _.map(_.get(financeChart, 'data'), (item) => _.floor(_.get(item, 'out'), FLOOR) || null)
    const financeIncomeSum = _.sumBy(financeIncome, (item) => item)
    const financeExpenseSum = _.sumBy(financeExpense, (item) => item)

    // CURRENCY DATA //
    const currencyListActive = _.get(currencyData, 'active')

    const noActiveWidgets = !orderChartActive && !orderReturnActive && !agentsChartActive && !financeChartActive && !currencyListActive
    const emptySales = _.isEmpty(orderChartSalesCash) && !orderChartLoading
    const emptyOrders = _.isEmpty(orderChartReturns) && !orderReturnLoading
    const emptyAgents = _.isEmpty(agentsList) && !agentsChartLoading
    const emptyFinance = _.isEmpty(financeIncome) && _.isEmpty(financeExpense) && !financeChartLoading
    const noData = (
        <div className={classes.noData}>
            <div>Нет данных за этот период</div>
        </div>
    )
    const FAB = (
            <FloatingActionButton
                backgroundColor={'#12aaeb'}>
                <Language/>
            </FloatingActionButton>
    )
    const fabMenuStyle = {
        defaultMenu: {
            fontSize: '13px'
        },
        activeMenu: {
            color: '#12aaeb',
            fontSize: '13px',
            fontWeight: '600'
        }
    }
    const langIsUZ = getLanguage() === 'uz'
    const langIsRU = getLanguage() === 'ru'
    const langIsEN = getLanguage() === 'en'
    return (
        <Container>
            <div className={classes.wrapper}>
                <div className={classes.languageWrapper}>
                    <div className={classes.fabToolTip}>{t('язык системы')}</div>
                    <IconMenu
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        iconButtonElement={FAB}>
                        <MenuItem style={langIsUZ ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="Ўзбекча" onTouchTap={() => props.setLangAction('uz')}/>
                        <MenuItem style={langIsRU ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="Русский" onTouchTap={() => props.setLangAction('ru')}/>
                        <MenuItem style={langIsEN ? fabMenuStyle.activeMenu : fabMenuStyle.defaultMenu} primaryText="English" onTouchTap={() => props.setLangAction('en')}/>
                    </IconMenu>
                </div>

                <Paper zDepth={1} className={classes.header}>
                    <div className={classes.user}>
                        <div className={classes.userImage}/>
                        <h4>{username}</h4>
                        <span>({position})</span>
                        {!openEditPass &&
                        <ToolTip position={'right'} text={'Изменить пароль'}>
                            <EditIcon color={'#666'} onClick={() => { setOpenEditPass(true) }}/>
                        </ToolTip>}
                    </div>
                    <div className={classes.buttons}>
                        <Filter
                            filter={filter}
                            initialValues={dateInitialValues}/>
                        <Widgets
                            list={widgetsForm.list}
                            loading={widgetsForm.loading}
                            initialValues={widgetsForm.initialValues}/>
                    </div>
                </Paper>

                <section className={classes.chartsWrapper} ref="wrapper">
                    <div className={classes.chartHalf}>
                        {currencyListActive && <Currencies currencyData={currencyData}/>}

                        {orderChartActive &&
                        <Paper zDepth={1}>
                            <div className={classes.chartHeader}>
                                <div>{t('Продажи')}</div>
                            </div>
                            {emptySales
                                ? noData
                                : <div className={classes.chart}>
                                    <div className={classes.chartStats}>
                                        <div>{t('Нал')}: {numberFormat(orderChartSalesCashSum, primaryCurrency)}</div>
                                        <div>{t('Пер')}: {numberFormat(orderChartSalesBankSum, primaryCurrency)}</div>
                                        <div>{t('Сумма')}: {numberFormat(orderChartSalesTotalSum, primaryCurrency)}</div>
                                    </div>
                                    {orderChartLoading || loading
                                        ? <div className={classes.chartLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <OrderChart
                                            height={280}
                                            cashText={t('Нал')}
                                            bankText={t('Переч')}
                                            cashValues={orderChartSalesCash}
                                            bankValues={orderChartSalesBank}
                                            tooltipTitle={orderChartDate}
                                        />}
                                </div>}
                        </Paper>}
                        {orderReturnActive &&
                        <Paper zDepth={1}>
                            <div className={classes.chartHeader}>
                                <div>{t('Заказы и возвраты')}</div>
                            </div>
                            {emptyOrders
                                ? noData
                                : <div className={classes.chart}>
                                    <div className={classes.chartStats}>
                                        <div>{t('Продажи')}: {numberFormat(orderChartSalesTotalSum, primaryCurrency)}</div>
                                        <div>{t('Возвраты')}: {numberFormat(orderChartReturnsSum, primaryCurrency)}</div>
                                        <div>{t('Фактически')}: {numberFormat(orderChartFactSum, primaryCurrency)}</div>
                                    </div>
                                    {orderReturnLoading || loading
                                        ? <div className={classes.chartLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <SalesReturnsChart
                                            height={280}
                                            primaryText={t('Продажа')}
                                            secondaryText={t('Возврат')}
                                            primaryValues={orderChartSales}
                                            secondaryValues={orderChartReturns}
                                            tooltipTitle={orderReturnDate}
                                        />}
                                </div>}
                        </Paper>}
                    </div>
                    <div className={classes.chartHalf}>
                        {openEditPass &&
                        <Password
                            handleChangePassword={handleChangePassword}
                            setOpenEditPass={setOpenEditPass}/>}
                        {agentsChartActive && isAdmin &&
                        <Paper zDepth={1}>
                            <div className={classes.chartHeader + ' ' + classes.borderBottom}>
                                <div>{t('Статистика по агентам')}</div>
                            </div>
                            {emptyAgents
                                ? noData
                                : <div className={classes.chart}>
                                    {agentsChartLoading || loading
                                        ? <div className={classes.chartLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <AgentsChart
                                            agentsList={agentsList}
                                            ordersData={agentsOrders}
                                            returnsData={agentsReturns}
                                            factsData={agentsFact}
                                        />}
                                </div>}
                        </Paper>}
                        {financeChartActive &&
                        <Paper zDepth={1}>
                            <div className={classes.chartHeader}>
                                <div>{t('Оборот')}</div>
                            </div>
                            {emptyFinance
                                ? noData
                                : <div className={classes.chart}>
                                    <div className={classes.chartStats}>
                                        <div>{t('Приход')}: {numberFormat(financeIncomeSum, primaryCurrency)}</div>
                                        <div>{t('Расход')}: {numberFormat(financeExpenseSum, primaryCurrency)}</div>
                                    </div>
                                    {financeChartLoading || loading
                                        ? <div className={classes.chartLoader}>
                                            <Loader size={0.75}/>
                                        </div>
                                        : <FinanceChart
                                            primaryValues={financeIncome}
                                            secondaryValues={financeExpense}
                                            tooltipTitle={financeDate}
                                            height={260}
                                            primaryText={t('Приход')}
                                            secondaryText={t('Расход')}
                                        />}
                                </div>}
                        </Paper>}
                    </div>
                </section>

                {noActiveWidgets &&
                <div className={classes.emptyWidgets}>
                    <div>{t('Виджеты отключены')}, <br/> {t('включите, чтобы просмотреть статистику')}</div>
                </div>}
            </div>
        </Container>
    )
})

export default Dashboard
