import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import DivisionSearchField from '../../ReduxForm/DivisionSearchField'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import StatSaleDialog from './StatSaleDialog'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import dateFormat from '../../../helpers/dateFormat'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'

export const STAT_SALES_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DIVISION: 'division'
}

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
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
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '&:last-child': {
                        justifyContent: 'flex-end'
                    }
                }
            },
            '& .dottedList': {
                padding: '0',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
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
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px!important',
                position: 'relative',
                marginRight: '40px',
                '&:last-child': {
                    margin: '0'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflowY: 'auto',
            overflowX: 'hidden'
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
        diagram: {
            marginTop: '20px'
        },
        salesSummary: {
            '& > div:nth-child(odd)': {
                color: '#666'
            },
            '& > div:nth-child(even)': {
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'StatSalesFilterForm',
        enableReinitialize: true
    }),
)

const StatSalesGridList = enhance((props) => {
    const {
        classes,
        filter,
        graphData,
        onSubmit,
        listData,
        statSaleDialog,
        handleSubmit,
        detailData,
        handleGetDocument
    } = props

    const loading = _.get(listData, 'listLoading')
    let sum = 0
    let returnSum = 0
    const value = _.map(_.get(graphData, 'data'), (item) => {
        sum += _.toInteger(_.get(item, 'amount'))
        return _.toInteger(_.get(item, 'amount'))
    })

    const returnedValue = _.map(_.get(graphData, 'data'), (item) => {
        returnSum += _.toInteger(_.get(item, 'returnAmount'))
        return _.toInteger(_.get(item, 'returnAmount'))
    })

    const valueName = _.map(_.get(graphData, 'data'), (item) => {
        return dateFormat(_.get(item, 'date'))
    })

    const config = {
        chart: {
            type: 'areaspline',
            height: 180
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
        yAxis: {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            gridLineColor: '#fff',
            plotLines: [{
                value: 0,
                width: 1,
                color: 'transparent'
            }],
            labels: {
                enabled: false
            },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0
        },
        xAxis: {
            categories: valueName,
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            labels: {
                enabled: false
            }
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
            valueSuffix: ' ' + getConfig('PRIMARY_CURRENCY'),
            backgroundColor: '#363636',
            style: {
                color: '#fff'
            },
            borderRadius: 2,
            borderWidth: 0,
            enabled: true,
            shadow: true,
            useHTML: true,
            crosshairs: true,
            pointFormat: '<div class="diagramTooltip">' +
                                '{series.name}: {point.y}' +
                        '</div>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Продажа',
            data: value,
            color: '#6cc6de'

        },
        {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Возврат',
            data: returnedValue,
            color: '#EB9696'
        }]
    }

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№ Сделки</Col>
            <Col xs={2}>Дата</Col>
            <Col xs={3}>Магазин</Col>
            <Col xs={2}>Агент</Col>
            <Col xs={1}>Возврат</Col>
            <Col xs={2} tyle={{textAlign: 'right'}}>Сумма</Col>
        </Row>
    )

    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const list = (

        _.map(_.get(listData, 'data'), (item) => {
            const marketName = _.get(item, ['market', 'name'])
            const id = _.get(item, 'id')
            const createdDate = moment(_.get(item, 'createdDate')).locale('ru').format('DD MMM YYYY HH:MM')
            const firstName = _.get(item, ['user', 'firstName'])
            const secondName = _.get(item, ['user', 'secondName '])
            const totalPrice = _.get(item, 'totalPrice')
            const returnPrice = _.get(item, 'totalReturnedPrice')

            return (
                <Row key={id} className="dottedList">
                    <Col xs={1}><a onClick={() => { statSaleDialog.handleOpenStatSaleDialog(id) }}>{id}</a></Col>
                    <Col xs={2}>{createdDate}</Col>
                    <Col xs={3}>{marketName}</Col>
                    <Col xs={2}>
                        <div>{firstName} {secondName}</div>
                    </Col>
                    <Col xs={1}>{numberFormat(returnPrice)} {currentCurrency}</Col>
                    <Col xs={2} style={{textAlign: 'right'}}>{numberFormat(totalPrice)} {currentCurrency}</Col>
                </Row>
            )
        })

    )

    const page = (
            <div className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_SALES_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        name="division"
                                        component={DivisionSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Подразделение"
                                        fullWidth={true}/>
                                    <IconButton
                                        className={classes.searchButton}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        type="submit">
                                        <Search/>
                                    </IconButton>
                                </div>
                                <a className={classes.excel} onClick={handleGetDocument}>
                                    <Excel color="#fff"/> <span>Excel</span>
                                </a>
                            </form>
                            {loading
                            ? <div className={classes.loader}>
                                <CircularProgress size={70} thickness={4} />
                            </div>
                            : (_.isEmpty(list) && !loading)
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>
                                : <div>
                                    <Row className={classes.diagram}>
                                        <Col xs={3} className={classes.salesSummary}>
                                            <div>Сумма продаж за период</div>
                                            <div>{numberFormat(sum, getConfig('PRIMARY_CURRENCY'))}</div>
                                            <div>Сумма возврата за период</div>
                                            <div>{numberFormat(returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                                            <div>Фактическая сумма продаж</div>
                                            <div>{numberFormat(sum - returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                                        </Col>
                                        <Col xs={9}>
                                            {_.get(graphData, 'graphLoading') && <div className={classes.loader}>
                                                <CircularProgress size={50} thickness={4} />
                                            </div>}
                                            {!_.get(graphData, 'graphLoading') &&
                                            <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>}
                                        </Col>
                                    </Row>
                                    <div className={classes.pagination}>
                                        <div><b>История продаж</b></div>
                                        <Pagination filter={filter}/>
                                    </div>
                                    <div className={classes.tableWrapper}>
                                        {headers}
                                        {list}
                                    </div>
                                  </div>
                            }
                        </div>
                    </div>
                </Row>
            </div>
    )

    return (
        <Container>
            {page}
            <StatSaleDialog
                loading={_.get(detailData, 'detailLoading')}
                detailData={detailData}
                open={statSaleDialog.openStatSaleDialog}
                onClose={statSaleDialog.handleCloseStatSaleDialog}
                filter={filter}/>
        </Container>
    )
})

StatSalesGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statSaleDialog: PropTypes.shape({
        openStatSaleDialog: PropTypes.bool.isRequired,
        handleOpenStatSaleDialog: PropTypes.func.isRequired,
        handleCloseStatSaleDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatSalesGridList
