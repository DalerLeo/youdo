import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import Back from 'material-ui/svg-icons/content/reply'
import NotFound from '../../Images/not-found.png'
import dateFormat from '../../../helpers/dateFormat'
import ReactHighcharts from 'react-highcharts'
import TransactionsList from '../Finance/TransactionsList'
import {StatisticsFilterExcel} from '../../Statistics'

export const STAT_CASHBOX_DETAIL_FILTER_KEY = {
    DIVISION: 'division',
    SEARCH: 'search',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        graphLoader: {
            extend: 'loader',
            height: '160px',
            marginTop: '20px'
        },
        detailWrapper: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '20'
        },
        wrapper: {
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px 30px',
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '40px',
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
            }
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
        button: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        closeDetail: {
            extend: 'button',
            background: '#12aaeb',
            marginRight: '10px'
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
                width: '170px !important',
                position: 'relative',
                marginRight: '40px',
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
                '&:last-child': {
                    '&:after': {
                        display: 'none'
                    }
                }
            }
        },
        balances: {
            padding: '20px 0',
            height: '160px',
            borderTop: '1px #efefef solid',
            marginTop: '20px'
        },
        sumItem: {
            '& > div:first-child': {
                marginBottom: '15px'
            },
            '& > div': {
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '20px',
                    fontWeight: '600'
                }
            }
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        navigation: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px #efefef solid'
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
        },
        salesSummary: {
            width: '440px',
            display: 'flex'
        }
    })
)

const StatCashboxDetails = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        initialValues
    } = props
    const graphLoading = _.get(detailData, 'itemGraphLoading') || _.get(detailData, 'sumItemDataLoading')
    const graphAmount = _.map(_.get(detailData, ['itemGraph']), (item) => {
        return _.toNumber(_.get(item, 'balance'))
    })
    const date = _.map(_.get(detailData, ['itemGraph']), (item) => {
        return dateFormat(_.get(item, 'date'))
    })

    const ZERO = 0
    const TEN = 10
    const config = {
        chart: {
            type: 'area',
            height: 120,
            showAxes: false,
            spacing: [ZERO, TEN, ZERO, TEN]
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
            categories: date,
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
            area: {
                fillColor: '#bfebf7',
                lineColor: '#3aa8c6'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: 'USD',
            backgroundColor: '#fff',
            borderColor: '#ccc',
            style: {
                color: '#333',
                fontFamily: 'Open Sans',
                fontSize: '11px'
            },
            borderRadius: 0,
            borderWidth: 1,
            enabled: true,
            shadow: false,
            useHTML: true,
            crosshairs: false,
            pointFormat: '{series.name}: <strong>{point.y}</strong>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle',
                fillColor: '#3aa8c6',
                radius: 2
            },
            name: 'Баланс',
            data: graphAmount,
            color: '#3aa8c6'

        }]
    }
    const handleCloseDetail = _.get(detailData, 'handleCloseDetail')
    const startBalance = _.get(detailData, ['sumItemData', 'startBalance'])
    const endBalance = _.get(detailData, ['sumItemData', 'endBalance'])
    const income = _.get(detailData, ['sumItemData', 'income'])
    const expenses = _.get(detailData, ['sumItemData', 'expenses'])
    const currency = _.get(detailData, ['data', 'currency', 'name'])

    const listData = {
        listLoading: _.get(detailData, 'transactionsLoading') || _.get(detailData, 'detailLoading'),
        data: _.get(detailData, 'transactionData')
    }

    const fields = (
        <Field
            className={classes.inputFieldCustom}
            name="date"
            component={DateToDateField}
            label="Диапазон дат"
            fullWidth={true}/>
    )

    const extraButton = (
        <a className={classes.closeDetail}
           onClick={handleCloseDetail}>
            <Back color="#fff"/> <span>Вернуться</span>
        </a>
    )

    return (
        <div className={classes.detailWrapper}>
                <div className={classes.wrapper}>
                    <StatisticsFilterExcel
                        filter={filter}
                        fields={fields}
                        filterKeys={STAT_CASHBOX_DETAIL_FILTER_KEY}
                        initialValues={initialValues}
                        handleSubmitFilterDialog={handleSubmitFilterDialog}
                        handleGetDocument={getDocument.handleGetDocument}
                        extraButton={extraButton}
                    />
                    {graphLoading
                    ? <div className={classes.graphLoader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    : <div className={classes.balances}>
                        <Row className={classes.diagram}>
                            <div className={classes.salesSummary}>
                                <div style={{marginRight: '40px'}} className={classes.sumItem}>
                                    <div className={classes.balanceItem}>
                                        <span>Баланс на начало периода</span>
                                        <div>{startBalance} {currency}</div>
                                    </div>
                                    <div className={classes.balanceItem}>
                                        <span>Баланс на конец периода</span>
                                        <div>{endBalance} {currency}</div>
                                    </div>
                                </div>
                                <div className={classes.sumItem}>
                                    <div className={classes.balanceItem}>
                                        <span>Доход за период</span>
                                        <div>{income} {currency}</div>
                                    </div>
                                    <div className={classes.balanceItem}>
                                        <span>Расход за период</span>
                                        <div>{expenses} {currency}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{width: 'calc(100% - 440px)'}}>
                                <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
                            </div>
                        </Row>
                    </div>}
                    <div className={classes.listWrapper}>
                        <TransactionsList
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            listData={listData}
                            filter={filter}/>
                    </div>
                </div>

        </div>
    )
})

StatCashboxDetails.propTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleSubmitFilterDialog: PropTypes.func,
    getDocument: PropTypes.object
}

export default StatCashboxDetails
