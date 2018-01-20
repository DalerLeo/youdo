import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import _ from 'lodash'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import StatSideMenu from '../StatSideMenu'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {
    TextField,
    DateToDateField,
    DivisionMultiSearchField,
    ClientMultiSearchField,
    ClientTransactionTypeSearchField
} from '../../ReduxForm'
import Loader from '../../Loader'
import moment from 'moment'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import NotFound from '../../Images/not-found.png'
import ClientBalanceFormat from './ClientBalanceFormat'
import t from '../../../helpers/translate'
import ToolTip from '../../ToolTip'
import CashPayment from 'material-ui/svg-icons/maps/local-atm'
import BankPayment from 'material-ui/svg-icons/action/credit-card'

const NEGATIVE = -1

export const CLIENT_INCOME_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
    DIVISION: 'division',
    TYPE: 'type',
    CLIENT: 'client'
}

const enhance = compose(
    injectSheet({
        green: {
            color: '#81c784',
            fontWeight: '600'
        },
        red: {
            color: '#e57373',
            fontWeight: '600'
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
                margin: '0'
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
            height: '160px',
            marginTop: '30px',
            padding: '0'
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
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        textAlign: 'right',
                        paddingRight: '0'
                    }
                }
            },
            '& .dottedList': {
                margin: '0 -30px !important',
                padding: '5px 30px',
                minHeight: '50px',
                '&:hover': {
                    background: '#f2f5f8'
                },
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
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '10px',
            '&:last-child': {
                margin: '0'
            }
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
        },
        payment: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            textAlign: 'right',
            '& > div:last-child': {
                marginLeft: '5px'
            }
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    })
)

const ClientIncomeGridList = enhance((props) => {
    const {
        graphData,
        classes,
        filter,
        handleSubmit,
        handleSubmitFilterDialog,
        handleGetDocument,
        initialValues,
        listData
    } = props

    const divisionStatus = getConfig('DIVISIONS')
    const graphLoading = _.get(graphData, 'graphInLoading') || _.get(graphData, 'graphOutLoading')
    const loading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const sumIn = _.sumBy(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueInName = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.get(item, 'date')
    })
    const valueOutName = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.get(item, 'date')
    })
    const tooltipDate = valueInName.length < valueOutName.length ? valueOutName : valueInName

    const sumOut = _.sumBy(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueIn = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueOut = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })

    const diff = sumIn - sumOut
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>{t('Дата')}</Col>
            <Col xs={2}>{t('Клиент')}</Col>
            <Col xs={2}>{t('Пользователь')}</Col>
            <Col xs={3}>{t('Описание')}</Col>
            <Col xs={2}>{t('Сумма')}</Col>
        </Row>
    )

    const ZERO = 0
    const list = _.map(_.get(listData, 'data'), (item, index) => {
        const transId = _.get(item, 'id')
        const user = _.get(item, 'user')
        const comment = _.get(item, 'comment')
        const client = _.get(item, ['client', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const userName = !_.isNull(user) ? user.firstName + ' ' + user.secondName : 'Не известно'
        const date = dateFormat(_.get(item, 'createdDate')) + ' ' + moment(_.get(item, 'createdDate')).format('HH:mm')
        const amount = _.toNumber(_.get(item, 'amount'))
        const internal = _.toNumber(_.get(item, 'internal'))
        const customRate = _.get(item, 'customRate') ? _.toInteger(_.get(item, 'customRate')) : _.toInteger(amount / internal)
        const type = _.get(item, 'type')
        const orderId = _.get(item, 'order')
        const orderReturnId = _.get(item, 'orderReturn')
        const paymentType = _.get(item, 'paymentType')
        return (
            <Row key={index} className="dottedList">
                <Col xs={1}>{transId}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={2}>{userName}</Col>
                <Col xs={3}>
                    {type && <div>
                        <ClientBalanceFormat type={type} order={orderId} orderReturn={orderReturnId}/>
                    </div>}
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? classes.green : (amount === ZERO ? '' : classes.red)}>
                        <div className={classes.payment}>
                            {numberFormat(amount, currency)}
                            <ToolTip position="bottom" text={paymentType === 'bank' ? 'банковский счет' : 'наличные'}>
                                {paymentType === 'bank'
                                    ? <BankPayment style={{height: '18px', width: '18px', color: '#6261b0'}}/>
                                    : <CashPayment style={{height: '18px', width: '18px', color: '#12aaeb'}}/>}
                            </ToolTip>
                        </div>
                        {primaryCurrency !== currency && <div>{numberFormat(internal, primaryCurrency)} <span
                            style={{fontSize: 11, color: '#666', fontWeight: 600}}>({customRate})</span></div>}
                    </div>
                </Col>
            </Row>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label={t('Диапазон дат')}
                fullWidth={true}/>
            <Field
                name="type"
                component={ClientTransactionTypeSearchField}
                className={classes.inputFieldCustom}
                label={t('Тип транзакции')}
                fullWidth={true}/>
            {divisionStatus && <Field
                name="division"
                component={DivisionMultiSearchField}
                className={classes.inputFieldCustom}
                label={t('Организация')}
                fullWidth={true}/>}
            <Field
                name="client"
                component={ClientMultiSearchField}
                className={classes.inputFieldCustom}
                label={t('Клиент')}
                fullWidth={true}/>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_CLIENT_INCOME_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={CLIENT_INCOME_FILTER_KEY}
                            fields={fields}
                            initialValues={initialValues}
                            handleGetDocument={handleGetDocument}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                        />
                        {graphLoading
                            ? <div className={classes.graphLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <Row className={classes.diagram}>
                                <Col xs={3} className={classes.salesSummary}>
                                    <div className={classes.secondarySummary}>
                                        <span className={classes.summaryTitle}>{t('Приход за период')}</span>
                                        <div className={classes.summaryValue}
                                             style={{color: '#5ecdea'}}>{numberFormat(sumIn)} {primaryCurrency}</div>
                                        <span className={classes.summaryTitle}>{t('Расход за период')}</span>
                                        <div className={classes.summaryValue}
                                             style={{color: '#EB9696'}}>{numberFormat(sumOut)} {primaryCurrency}</div>
                                        <span className={classes.summaryTitle}>{t('Разница')}</span>
                                        <div className={classes.summaryValue}
                                             style={diff >= ZERO ? {color: '#71ce87'} : {color: '#EB9696'}}>{numberFormat(diff)} {primaryCurrency}</div>
                                    </div>
                                </Col>
                                <Col xs={9} className={classes.chart}>
                                    <StatisticsChart
                                        tooltipTitle={tooltipDate}
                                        primaryValues={valueIn}
                                        secondaryValues={valueOut}
                                        mergedGraph={_.get(graphData, 'mergedGraph')}
                                        primaryText={t('Приход')}
                                        secondaryText={t('Расход')}
                                        height={160}
                                        merged={true}
                                    />
                                </Col>
                            </Row>}
                        <div className={classes.pagination}>
                            <div><b>История транзакции</b></div>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText={t('Поиск')}
                                    fullWidth={false}/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        {loading
                            ? <div className={classes.tableWrapper}>
                                <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                {_.isEmpty(list) && !loading
                                    ? <div className={classes.emptyQuery}>
                                        <div>{t('По вашему запросу ничего не найдено')}</div>
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

ClientIncomeGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default ClientIncomeGridList
