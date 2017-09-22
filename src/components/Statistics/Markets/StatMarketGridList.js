import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {TextField, DivisionSearchField, AgentSearchField} from '../../ReduxForm'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import LinearLoading from '../../LinearProgress/index'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import ReactHighcharts from 'react-highcharts'
import NotFound from '../../Images/not-found.png'
import dateFormat from '../../../helpers/dateFormat'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    DIVISION: 'division',
    AGENT: 'agent',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
            margin: '0 !important',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            padding: '20px 30px',
            '& > div:nth-child(2)': {
                marginTop: '10px'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            height: 'calc(100% - 140px)',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '& img': {
                        width: '35px',
                        height: '35px',
                        borderRadius: '4px',
                        marginRight: '10px'
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
                        content: '""',
                        background: 'none'
                    }
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
            overflow: 'hidden',
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
        summary: {
            borderTop: 'solid 1px #efefef',
            borderBottom: 'solid 1px #efefef',
            padding: '14px 0',
            color: '#666',
            '& > div': {
                fontSize: '24px',
                color: '#333',
                fontWeigh: '600'

            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& div:first-child': {
                fontWeight: '600'
            }
        }
    }),
    reduxForm({
        form: 'StatMarketFilterForm',
        enableReinitialize: true
    }),
)

const StatMarketGridList = enhance((props) => {
    const {
        listData,
        detailData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const graphLoading = _.get(detailData, ['graphLoading'])
    const sumData = _.get(listData, ['sumData', 'income'])
    const sumLoading = _.get(listData, ['sumLoading'])
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const value = _.map(_.get(detailData, ['graphList']), (item) => {
        return _.toInteger(_.get(item, 'amount'))
    })

    const valueName = _.map(_.get(detailData, ['graphList']), (item) => {
        return dateFormat(_.get(item, 'date'))
    })

    const config = {
        chart: {
            type: 'column',
            height: 145
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
            categories: valueName,
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
            column: {
                fillOpacity: 0.7
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' ' + primaryCurrency,
            backgroundColor: '#363636',
            style: {
                color: '#fff'
            },
            borderRadius: 2,
            borderWidth: 0,
            enabled: true,
            shadow: false,
            useHTML: true,
            crosshairs: true,
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Сумма',
            data: value,
            color: '#378ca2'

        }]
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
            <Col xs={3}>Магазины</Col>
            <Col xs={2}>Клиенты</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Продажи</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Возвраты</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Фактически</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const income = _.toNumber(_.get(item, 'income'))
        const actual = _.toNumber(_.get(item, 'actualSales'))
        const returns = _.toNumber(_.get(item, 'orderReturns'))
        const clientName = _.get(item, 'clientName')

        if (id === _.get(detailData, 'id')) {
            return (
                <div key={index}>
                    <Row>
                        <Col xs={3}>
                            <span>{name}</span>
                        </Col>
                        <Col xs={2}>{clientName}</Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(income, primaryCurrency)}</Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(returns, primaryCurrency)}</Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(actual, primaryCurrency)}</Col>
                        <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                            <IconButton
                                onTouchTap={() => { detailData.handleCloseDetail() }}>
                                <List color="#12aaeb"/>
                            </IconButton>
                        </Col>
                    </Row>
                    {graphLoading ? <div style={{position: 'relative'}}><LinearLoading/></div>
                        : <ReactHighcharts
                        config={config}
                        neverReflow={true}
                        isPureConfig={true}
                        />}
                </div>
            )
        }

        return (
            <Row key={index} className="dottedList">
                <Col xs={3}>
                    <span>{name}</span>
                </Col>
                <Col xs={2}>{clientName}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(income, primaryCurrency)}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(returns, primaryCurrency)}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(actual, primaryCurrency)}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={() => { detailData.handleOpenDetail(id) }}>
                        <List color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_MARKET_URL}/>
                </div>
                <div className={classes.rightPanel}>
                     <div className={classes.wrapper}>
                        <form className={classes.form} onSubmit={ handleSubmitFilterDialog }>
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
                                    fullWidth={true}
                                />
                                <Field
                                    name="agent"
                                    component={AgentSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Агент"
                                    fullWidth={true}
                                />
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    label="Магазин"
                                    fullWidth={true}/>

                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit">
                                    <Search/>
                                </IconButton>
                            </div>
                            <a className={classes.excel}
                               onClick={getDocument.handleGetDocument}>
                                <Excel color="#fff"/> <span>Excel</span>
                            </a>
                        </form>

                        {listLoading
                             ? <div className={classes.loader}>
                                 <CircularProgress size={40} thickness={4}/>
                             </div>
                             : (_.isEmpty(list) && sumLoading && !listLoading)
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                  </div>
                                : <div>
                                    <div className={classes.summary}>Сумма от продаж
                                        <div>
                                            {numberFormat(sumData, primaryCurrency)}
                                        </div>
                                    </div>
                                    <div className={classes.pagination}>
                                        <div>Продажи по магазинам в зоне</div>
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

StatMarketGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statMarketDialog: PropTypes.shape({
        openStatMarketDialog: PropTypes.bool.isRequired,
        handleOpenStatMarketDialog: PropTypes.func.isRequired,
        handleCloseStatMarketDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatMarketGridList
