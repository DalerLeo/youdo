import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import _ from 'lodash'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import {
    DateToDateField,
    TransactionTypeSearchField,
    ExpensiveCategorySearchField,
    ClientSearchField,
    TextField
} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {formattedType, ORDER, INCOME_FROM_AGENT} from '../../../constants/transactionTypes'
import CircularProgress from 'material-ui/CircularProgress'
import {StatisticsFilterExcel} from '../../Statistics'
import NotFound from '../../Images/not-found.png'
import sprintf from 'sprintf'
import {Link} from 'react-router'

export const STAT_FINANCE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
    TYPE: 'type',
    CATEGORY_EXPENSE: 'categoryExpense',
    CLIENT: 'client',
    DIVISION: 'division'
}

const NEGATIVE = -1

const enhance = compose(
    injectSheet({
        green: {
            color: '#81c784'
        },
        red: {
            color: '#e57373'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: '100%',
            overflowY: 'auto',
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        graphLoader: {
            extend: 'loader',
            padding: '0',
            height: '160px',
            marginTop: '20px'
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    '&:last-child': {
                        textAlign: 'right'
                    }
                }
            },
            '& .dottedList': {
                padding: '5px 0',
                minHeight: '50px',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                },
                '& a': {
                    fontWeight: '600'
                }
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                height: '30px',
                minWidth: '30px',
                width: '30px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        balanceInfo: {
            padding: '15px 0'
        },
        balance: {
            paddingRight: '10px',
            fontSize: '24px!important',
            fontWeight: '600'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden'
        },
        diagram: {
            marginTop: '20px',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '& > div:last-child': {
                paddingRight: '0'
            }
        },
        summaryTitle: {
            color: '#666'
        },
        summaryValue: {
            fontSize: '20px',
            fontWeight: '600'
        },
        mainSummary: {
            '& > div:last-child': {
                borderBottom: '1px #efefef solid',
                paddingBottom: '10px'
            }
        },
        secondarySummary: {
            margin: '10px 0',
            '& span': {
                display: 'block'
            },
            '& > div': {
                fontSize: '16px'
            }
        },
        chart: {
            '& .highcharts-label': {
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px !important'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const StatFinanceGridList = enhance((props) => {
    const {
        graphData,
        classes,
        filter,
        handleSubmit,
        handleSubmitFilterDialog,
        listData,
        initialValues
    } = props

    const loading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const sumIn = _.sumBy(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueIn = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const sumOut = _.sumBy(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueOut = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueInName = _.map(_.get(graphData, 'dataIn'), (item) => {
        return dateFormat(_.get(item, 'date'))
    })
    const graphLoading = _.get(graphData, 'graphInLoading') || _.get(graphData, 'graphOutLoading')
    const profit = sumIn - sumOut
    const config = {
        chart: {
            type: 'areaspline',
            height: 160
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: valueInName,
            tickmarkPlacement: 'on',
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            gridLineColor: '#efefef',
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        plotOptions: {
            series: {
                lineWidth: 0,
                pointPlacement: 'on'
            },
            areaspline: {
                fillOpacity: 0.7
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' ' + primaryCurrency,
            backgroundColor: '#fff',
            style: {
                color: '#666',
                fontFamily: 'Open Sans',
                fontWeight: '600'
            },
            borderRadius: 0,
            borderWidth: 0,
            enabled: true,
            shadow: true,
            useHTML: true,
            crosshairs: true,
            pointFormat:
            '<div class="diagramTooltip">' +
            '{series.name}: {point.y}' +
            '</div>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Доход',
            data: valueIn,
            color: '#6cc6de'

        },
        {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Расход',
            data: valueOut,
            color: '#EB9696'

        }]
    }

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>Касса</Col>
            <Col xs={2}>Дата</Col>
            <Col xs={4}>Описание</Col>
            <Col xs={3}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(_.get(item, 'createdDate'))
        const amount = numberFormat(_.get(item, 'amount'), primaryCurrency)
        const comment = _.get(item, 'comment')
        const cashbox = _.get(item, ['cashbox', 'name'])
        const order = _.get(item, 'order')
        const transType = _.toInteger(_.get(item, 'type'))
        const user = _.get(item, 'user')
        const clientName = _.get(item, ['client', 'name'])
        const clientId = _.get(item, ['client', 'id'])
        const type = formattedType[transType]
        return (
            <Row key={id} className="dottedList">
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{cashbox}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={4}>
                    {transType === ORDER
                    ? <Link target="_blank" to={{
                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, order),
                        query: {search: order}
                    }}><span className={classes.clickable}> Оплата заказа № {order}</span>
                    </Link>
                    : transType === INCOME_FROM_AGENT
                    ? <Link target="_blank" to={{
                        pathname: ROUTES.TRANSACTION_LIST_URL,
                        query: {openTransactionInfo: id}
                    }}>{'Приемка наличных с  ' + user.firstName + ' ' + user.secondName}</Link>
                    : <strong>{type}
                        {clientName &&
                        <Link
                            target="_blank"
                            className={classes.clickable}
                            to={{
                                pathname: ROUTES.CLIENT_BALANCE_LIST_URL,
                                query: {search: clientId}
                            }}>
                        {clientName}
                        </Link>}
                    </strong>
                    }
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={3} style={{textAlign: 'right'}}>{amount}</Col>
            </Row>
        )
    })

    const fields = (
        <div>
            <Field className={classes.inputFieldCustom} name="date" component={DateToDateField} label="Диапазон дат" fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="categoryExpense" component={ExpensiveCategorySearchField} label="Категории расходов" fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="type" component={TransactionTypeSearchField} label="Тип" fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="client" component={ClientSearchField} label="Клиент" fullWidth={true}/>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_FINANCE_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={STAT_FINANCE_FILTER_KEY}
                            fields={fields}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            initialValues={initialValues}
                        />
                        {graphLoading
                        ? <div className={classes.graphLoader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                        : <Row className={classes.diagram}>
                            <Col xs={3} className={classes.salesSummary}>
                                <div className={classes.mainSummary}>
                                    <div className={classes.summaryTitle}>Прибыль за период</div>
                                    <div className={classes.summaryValue}>{numberFormat(profit, primaryCurrency)}</div>
                                </div>
                                <div className={classes.secondarySummary}>
                                    <span className={classes.summaryTitle}>Доход</span>
                                    <div
                                        className={classes.summaryValue + ' ' + classes.green}>{numberFormat(sumIn)} {primaryCurrency}</div>
                                    <div style={{margin: '5px 0'}}> </div>
                                    <span className={classes.summaryTitle}>Расход</span>
                                    <div
                                        className={classes.summaryValue + ' ' + classes.red}>{numberFormat(sumOut)} {primaryCurrency}</div>
                                </div>
                            </Col>
                            <Col xs={9} className={classes.chart}>
                                <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
                            </Col>
                        </Row>}
                        <div className={classes.pagination}>
                            <div><b>Транзакции</b></div>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText="Поиск"/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        {loading
                            ? <div className={classes.tableWrapper}>
                                <div className={classes.loader}>
                                    <CircularProgress thickness={4} size={40}/>
                                </div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                {_.isEmpty(list) && !loading
                                    ? <div className={classes.emptyQuery}>
                                        <div>По вашему запросу ничего не найдено</div>
                                    </div>
                                    : <div>
                                        {headers}
                                        {list}
                                    </div>}
                            </div>}
                    </div>
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
        </Container>
    )
})

StatFinanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatFinanceGridList
