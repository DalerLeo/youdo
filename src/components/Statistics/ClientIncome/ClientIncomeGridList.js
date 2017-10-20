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
    DivisionSearchField,
    ClientSearchField,
    ClientTransactionTypeSearchField
} from '../../ReduxForm'
import CircularProgress from 'material-ui/CircularProgress'
import moment from 'moment'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import NotFound from '../../Images/not-found.png'

import {
    PAYMENT,
    CANCEL,
    ORDER_RETURN,
    CANCEL_ORDER,
    CANCEL_ORDER_RETURN,
    EXPENSE,
    ORDER,
    formattedType
} from '../../../constants/clientBalanceInfo'

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
            fontSize: '22px',
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

    const divisionStatus = getConfig('DIVISION')
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
            <Col xs={2}>Дата</Col>
            <Col xs={2}>Клиент</Col>
            <Col xs={2}>Пользователь</Col>
            <Col xs={3}>Описание</Col>
            <Col xs={2}>Сумма</Col>
        </Row>
    )

    const ZERO = 0
    const THREE = 3
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
        const id = _.toInteger(type) === THREE ? _.get(item, 'orderReturn') : (_.get(item, 'order') || _.get(item, 'transaction'))
        return (
            <Row key={index} className="dottedList">
                <Col xs={1}>{transId}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={2}>{userName}</Col>
                <Col xs={3}>
                    {type && <div><span>{type === PAYMENT ? 'Оплата'
                        : type === CANCEL ? 'Отмена'
                            : type === CANCEL_ORDER ? <Link to={{
                                pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                                query: {search: id}
                            }} target="_blank">Отмена заказа № + {id}</Link>
                                : type === CANCEL_ORDER_RETURN ? <Link to={{
                                    pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                                    query: {search: id}
                                }} target="_blank">Отмена возврата № + {id}</Link>
                                    : type === ORDER ? <Link to={{
                                        pathname: sprintf(ROUTES.RETURN_ITEM_PATH, id),
                                        query: {search: id}
                                    }} target="_blank">Заказ {id}</Link>
                                        : type === EXPENSE ? 'Расход'
                                            : type === ORDER_RETURN ? <Link to={{
                                                pathname: sprintf(ROUTES.RETURN_ITEM_PATH, id),
                                                query: {search: id}
                                            }} target="_blank">Возврат {id}</Link>
                                                : formattedType[type] + ' ' + (!_.isNull(id) ? id : '')}</span>
                    </div>}
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? 'greenFont' : (amount === ZERO ? '' : 'redFont')}>
                        <span>{numberFormat(amount, currency)}</span>
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
                label="Диапазон дат"
                fullWidth={true}/>
            <Field
                name="type"
                component={ClientTransactionTypeSearchField}
                className={classes.inputFieldCustom}
                label="Тип транзакции"
                fullWidth={true}/>
            {divisionStatus && <Field
                name="division"
                component={DivisionSearchField}
                className={classes.inputFieldCustom}
                label="Подразделение"
                fullWidth={true}/>}
            <Field
                name="client"
                component={ClientSearchField}
                className={classes.inputFieldCustom}
                label="Клиент"
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
                                <CircularProgress thickness={4} size={40}/>
                            </div>
                            : <Row className={classes.diagram}>
                                <Col xs={3} className={classes.salesSummary}>
                                    <div className={classes.secondarySummary}>
                                        <span className={classes.summaryTitle}>Приход за период</span>
                                        <div className={classes.summaryValue}
                                             style={{color: '#5ecdea'}}>{numberFormat(sumIn)} {primaryCurrency}</div>
                                        <div style={{margin: '10px 0'}}>{null}</div>
                                        <span className={classes.summaryTitle}>Расход за период</span>
                                        <div className={classes.summaryValue}
                                             style={{color: '#EB9696'}}>{numberFormat(sumOut)} {primaryCurrency}</div>
                                        <div style={{margin: '10px 0'}}>{null}</div>
                                        <span className={classes.summaryTitle}>Разница</span>
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
                                        primaryText="Приход"
                                        secondaryText="Расход"
                                        height={160}
                                        clentIncome={true}
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
                                    hintText="Поиск"
                                    fullWidth={false}/>
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

ClientIncomeGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default ClientIncomeGridList
