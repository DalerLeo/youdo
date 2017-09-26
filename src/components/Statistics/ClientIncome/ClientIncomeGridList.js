import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import _ from 'lodash'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import {DivisionSearchField, TextField, ClientSearchField, ClientTransactionTypeSearchField} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Filter from 'material-ui/svg-icons/content/filter-list'
import Close from 'material-ui/svg-icons/action/highlight-off'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import moment from 'moment'
import {Link} from 'react-router'
import sprintf from 'sprintf'

export const CLIENT_INCOME_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
    DIVISION: 'division',
    TYPE: 'type',
    CLIENT: 'client'
}

import {
    PAYMENT,
    CANCEL,
    ORDER_RETURN,
    CANCEL_ORDER,
    CANCEL_ORDER_RETURN,
    EXPENSE,
    FIRST_BALANCE,
    ORDER,
    NONE_TYPE
} from '../../../constants/clientBalanceInfo'

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
        filterWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        form: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '300px',
            background: '#fff',
            zIndex: '10'
        },
        filter: {
            display: 'flex',
            width: '100%',
            padding: '20px 30px',
            flexDirection: 'column',
            position: 'relative',
            '& h3': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
            }
        },
        closeFilter: {
            position: 'absolute !important',
            top: 10,
            right: 10
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
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        filterBtn: {
            extend: 'excel',
            background: '#12aaeb'
        },
        diagram: {
            marginTop: '30px'
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
        }
    }),
    reduxForm({
        form: 'ClientIncomeFilterForm',
        enableReinitialize: true
    }),
    withState('openFilter', 'setOpenFilter', false)
)

const ClientIncomeGridList = enhance((props) => {
    const {
        graphData,
        classes,
        filter,
        handleSubmit,
        handleSubmitFilterDialog,
        openFilter,
        setOpenFilter,
        handleGetDocument,
        listData
    } = props

    const loading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const sumIn = _.sumBy(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueInName = _.map(_.get(graphData, 'dataIn'), (item) => {
        return dateFormat(_.get(item, 'date'))
    })

    const sumOut = _.sumBy(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueIn = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueOut = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
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
            color: '#81c784'

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

    const iconStyle = {
        button: {
            width: 44,
            height: 44,
            padding: 11
        },
        icon: {
            width: 22,
            height: 22,
            color: '#666'
        }
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
        const customRate = _.get(item, 'customRate') ? _.get(item, 'customRate') : _.toInteger(amount / internal)
        const type = _.get(item, 'type')
        const id = _.toInteger(type) === THREE ? _.get(item, 'orderReturn') : (_.get(item, 'order') || _.get(item, 'transaction'))
        return (
            <Row key={index} className="dottedList">
                <Col xs={1}>{transId}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={2}>{userName}</Col>
                <Col xs={3}>
                    {type && <div><strong>Тип:</strong> <span>{type === PAYMENT ? 'Оплата'
                        : type === CANCEL ? 'Отмена'
                            : type === CANCEL_ORDER ? 'Отмена заказа №' + id
                                : type === CANCEL_ORDER_RETURN ? 'Отмена возврата №' + id
                                    : type === ORDER ? <Link to={{
                                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                                        query: {search: id}
                                    }} target="_blank">Заказ {id}</Link>
                                        : type === EXPENSE ? 'Расход'
                                            : type === ORDER_RETURN ? <Link to={{
                                                pathname: sprintf(ROUTES.RETURN_ITEM_PATH, id),
                                                query: {search: id}
                                            }} target="_blank">Возврат {id}</Link>
                                                : type === FIRST_BALANCE ? 'Первый баланс'
                                                    : type === NONE_TYPE ? 'Произвольный' : null }</span>
                    </div>}
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={2} style={{textAlign: 'right'}}>
                    <div className={amount > ZERO ? 'greenFont' : (amount === ZERO ? '' : 'redFont')}>
                        <span>{numberFormat(amount, currency)}</span>
                        {primaryCurrency !== currency && <div>{numberFormat(internal, primaryCurrency)} <span style={{fontSize: 11, color: '#666', fontWeight: 600}}>({customRate})</span></div>}
                    </div>
                </Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_CLIENT_INCOME_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        {loading
                            ? <div className={classes.loader}>
                                <CircularProgress/>
                            </div>
                            : <div>
                                <div className={classes.filterWrapper}>
                                    {openFilter && <Paper zDepth={2} className={classes.form}>
                                        <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                            <div className={classes.filter}>
                                                <h3>Фильтр</h3>
                                                <IconButton
                                                    className={classes.closeFilter}
                                                    style={iconStyle.button}
                                                    iconStyle={iconStyle.icon}
                                                    onTouchTap={() => { setOpenFilter(false) }}>
                                                    <Close />
                                                </IconButton>
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
                                                <Field
                                                    name="division"
                                                    component={DivisionSearchField}
                                                    className={classes.inputFieldCustom}
                                                    label="Подразделение"
                                                    fullWidth={true}/>
                                                <Field
                                                    name="client"
                                                    component={ClientSearchField}
                                                    className={classes.inputFieldCustom}
                                                    label="Клиент"
                                                    fullWidth={true}/>

                                                <FlatButton
                                                    label="Применить"
                                                    fullWidth={false}
                                                    labelStyle={{color: '#12aaeb', textTransform: 'none', fontWeight: '600'}}
                                                    className={classes.searchButton}
                                                    type="submit" />
                                            </div>
                                        </form>
                                    </Paper>}
                                    <a className={classes.filterBtn} onClick={() => { setOpenFilter(true) }}>
                                        <Filter color="#fff"/> <span>Фильтр</span>
                                    </a>
                                    <a className={classes.excel} onClick={handleGetDocument}>
                                        <Excel color="#fff"/> <span>Excel</span>
                                    </a>
                                </div>
                                <Row className={classes.diagram}>
                                    <Col xs={3} className={classes.salesSummary}>
                                        <div className={classes.secondarySummary}>
                                            <span className={classes.summaryTitle}>Приход за период</span>
                                            <div className={classes.summaryValue} style={{color: '#81c784 '}}>{numberFormat(sumIn)} {primaryCurrency}</div>
                                            <div style={{margin: '10px 0'}}> </div>
                                            <span className={classes.summaryTitle}>Расход за период</span>
                                            <div className={classes.summaryValue} style={{color: '#EB9696'}}>{numberFormat(sumOut)} {primaryCurrency}</div>
                                        </div>
                                    </Col>
                                    <Col xs={9} className={classes.chart}>
                                        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
                                    </Col>
                                </Row>
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
                                <div className={classes.tableWrapper}>
                                    {headers}
                                    {list}
                                </div>
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
