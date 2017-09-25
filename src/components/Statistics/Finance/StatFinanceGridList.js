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
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import {DivisionSearchField, TextField} from '../../ReduxForm/index'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {formattedType} from '../../../constants/transactionTypes'
import CircularProgress from 'material-ui/CircularProgress'

export const STAT_FINANCE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
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
        diagram: {
            marginTop: '30px'
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
        }
    }),
    reduxForm({
        form: 'StatFinanceFilterForm',
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
        listData
    } = props

    const loading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    let sumIn = 0
    const valueIn = _.map(_.get(graphData, 'dataIn'), (item) => {
        sumIn += _.toInteger(_.get(item, 'amount'))
        return _.toInteger(_.get(item, 'amount'))
    })
    const valueInName = _.map(_.get(graphData, 'dataIn'), (item) => {
        return dateFormat(_.get(item, 'date'))
    })

    let sumOut = 0
    const valueOut = _.map(_.get(graphData, 'dataOut'), (item) => {
        sumOut += _.toInteger(_.get(item, 'amount')) * NEGATIVE
        return _.toInteger(_.get(item, 'amount')) * NEGATIVE
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
            <Col xs={2}>№ заказа</Col>
            <Col xs={2}>Дата</Col>
            <Col xs={5}>Описание</Col>
            <Col xs={3}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const date = dateFormat(_.get(item, 'createdDate'))
        const amount = numberFormat(_.get(item, 'amount'), primaryCurrency)
        const comment = _.get(item, 'comment')
        const transType = _.get(item, 'type')
        const user = _.get(item, 'user')
        const type = formattedType[transType]
        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>{id}</Col>
                <Col xs={2}>{date}</Col>
                <Col xs={5}>
                    <div><strong>Тип:</strong> {type} {!_.isNull(user) &&
                    <strong>{user.firstName} {user.secondName}</strong>}</div>
                    {comment && <div><strong>Комментарий:</strong> {comment}</div>}
                </Col>
                <Col xs={3} style={{textAlign: 'right'}}>{amount}</Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_FINANCE_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        {loading
                            ? <div className={classes.loader}>
                                <CircularProgress/>
                            </div>
                            : <div>
                                <form className={classes.form} onSubmit={handleSubmit(handleSubmitFilterDialog)}>
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
                                        <Field
                                            className={classes.inputFieldCustom}
                                            name="search"
                                            component={TextField}
                                            label="Поиск"
                                            fullWidth={true}/>

                                        <IconButton
                                            className={classes.searchButton}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            type="submit">
                                            <Search/>
                                        </IconButton>
                                    </div>
                                    <a className={classes.excel}>
                                        <Excel color="#fff"/> <span>Excel</span>
                                    </a>
                                </form>
                                <Row className={classes.diagram}>
                                    <Col xs={3} className={classes.salesSummary}>
                                        <div className={classes.mainSummary}>
                                            <div className={classes.summaryTitle}>Прибыль за период</div>
                                            <div className={classes.summaryValue}>5 000 000 {primaryCurrency}</div>
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
                                </Row>
                                <div className={classes.pagination}>
                                    <div><b>История заказов</b></div>
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

StatFinanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatFinanceGridList
