import _ from 'lodash'
import injectSheet from 'react-jss'
import React from 'react'
import sprintf from 'sprintf'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import ReactHighcharts from 'react-highcharts'
import Paper from 'material-ui/Paper'
import {Link} from 'react-router'
import numberFormat from '../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
import Container from '../Container'
import StatCashboxOrderDetails from './StatCashboxOrderDetails'
import SubMenu from '../SubMenu'
import * as ROUTES from '../../constants/routes'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import FiberManualRecord from 'material-ui/svg-icons/av/fiber-manual-record'

const enhance = compose(
    injectSheet({
        infoBlock: {
            width: '25%',
            display: 'inline-block',
            color: '#999',
            fontWeight: '400',
            fontSize: '13px',
            lineHeight: '1.3',
            borderLeft: '1px solid #efefef',
            padding: '12px 15px 12px 15px',
            alignItems: 'center',
            '& span': {
                color: '#333',
                fontWeight: '600',
                fontSize: '24px !important'
            },
            '&:first-child': {
                border: 'none'
            }
        },
        typeListStock: {
            width: '100px',
            height: 'calc(100% + 16px)',
            marginTop: '-8px',
            float: 'left',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            borderRight: '1px solid #fff',
            backgroundColor: '#eceff5',
            '& a': {
                display: 'block',
                width: '100%',
                fontWeight: '600'
            },
            '& a.active': {
                color: '#333',
                cursor: 'text'
            },
            '&:last-child': {
                border: 'none'
            },
            '&:first-child': {

                marginLeft: '-38px'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        link: {
            color: '#12aaeb !important',
            borderBottom: '1px dashed',
            fontWeight: '400 !important'
        },
        loader: {
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        manufactures: {
            margin: '0 -28px',
            padding: '0 28px'
        },
        tabWrapper: {
            display: 'flex',
            width: '100%'
        },
        tab: {
            cursor: 'pointer',
            padding: '20px',
            height: '100%'
        },
        activeTab: {
            paddingBottom: '20px',
            flexBasis: '20%',
            marginRight: '15px',
            '&:last-child': {
                margin: '0'
            },
            '& a': {
                color: 'inherit !important'
            }
        },
        tabTitle: {
            fontWeight: '600',
            marginBottom: '10px',
            '& span': {
                color: '#999',
                display: 'block',
                fontWeight: 'normal'
            }
        },
        tabText: {
            fontSize: '10px',
            color: '#666',
            fontWeight: '600',
            '& span': {
                display: 'block',
                fontSize: '18px !important',
                color: '#333'
            }
        },
        stats: {
            margin: '0 -28px',
            padding: '0 28px',
            background: '#fff',
            minHeight: 'calc(100% - 148px)'
        },
        statTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            padding: '25px 28px',
            margin: '0 -28px',
            '& a': {
                fontWeight: '600'
            }
        },
        diagram: {
            padding: '20px 28px',
            margin: '0 -28px',
            borderBottom: '1px #f0f0f0 solid',
            borderTop: '1px #f0f0f0 solid',
            '& > div': {
                margin: '-20px 0',
                padding: '20px 0',
                '&:first-child': {
                    paddingRight: '10px'
                },
                '&:last-child': {
                    paddingLeft: '10px'
                }
            }
        },
        balanceInfo: {
            borderLeft: '1px #f0f0f0 solid'
        },
        balance: {
            padding: '15px 0',
            borderBottom: '1px #f0f0f0 solid',
            '&:last-child': {
                border: 'none'
            },
            '& div:last-child': {
                fontSize: '24px',
                fontWeight: '600'
            }
        },
        categoryExpens: {
            display: 'flex',
            width: '100%',
            margin: '20px 0',
            alignItems: 'center'
        },
        bulletProof: {
            columnCount: '3',
            columnGap: '20px',
            margin: '0',
            padding: '0',
            '& li': {
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                '& div:first-child': {
                    marginRight: '5px'
                }
            }
        }
    }),
)

const StatCashboxGridList = enhance((props) => {
    const {
        filter,
        listData,
        detailData,
        classes,
        orderData
    } = props

    const detailId = _.get(detailData, 'id')
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const cashbox = _.get(item, 'name')
        const type = _.toInteger(_.get(item, 'type'))
        const balance = numberFormat((_.get(item, 'balance')))
        const currency = _.get(item, ['currency', 'name'])
        const BANK_ID = 1
        return (
        <div key={id} className={classes.activeTab} style={ detailId === id ? {backgroundColor: '#f2f5f8'} : {}}>
            <Paper key={id} zDepth={1} className={classes.tab}>
                <Link
                    to={{
                        pathname: sprintf(ROUTES.TRANSACTION_ITEM_PATH, id),
                        query: filter.getParams({'cashboxId': id})
                    }}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabTitle}>
                            {cashbox}
                            {type === BANK_ID
                                ? <span>банковский счет</span>
                                : <span>наличные</span>
                            }
                        </div>
                        <div className={classes.tabText}>
                            <div>БАЛАНС</div>
                            <span>{balance} {currency}</span>
                        </div>
                    </div>
                </Link>
            </Paper>
        </div>
        )
    })

    const sempl = 1

    const configCercle = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 180,
            width: 200,
            margin: 0
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },

        plotOptions: {
            pie: {
                slicedOffset: 0,
                innerSize: '60%',
                size: '100%',
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        tooltip: {
            enabled: false
        },
        title: {
            style: {
                display: 'none'
            }
        },

        series: [{
            data: [{
                data: 'Производство',
                y: 10,
                color: '#466d7c'
            }, {
                data: 'Производство',
                y: 15,
                color: '#8dbc2e'
            }, {
                data: 'Производство',
                y: 20,
                color: '#00bfdb'
            }, {
                data: 'Производство',
                y: 25,
                color: '#a16cb4'
            }, {
                data: 'Производство',
                y: 10,
                color: '#ff8500'
            }, {
                data: 'Производство',
                y: 20,
                color: '#ff6d65'
            }]
        }]
    }

    const config = {
        chart: {
            type: 'areaspline',
            height: 245
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            valueSuffix: ' %',
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
            pointFormat: '{series.name}: <b>{point.y}</b><br/>в отношении к BoM<br/>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'Эффективность',
            data: [sempl + sempl + sempl + sempl, sempl + sempl + sempl, sempl + sempl + sempl + sempl],
            color: '#7560a5'

        }, {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'BoM',
            data: [sempl + sempl + sempl, sempl + sempl + sempl + sempl, sempl + sempl + sempl],
            color: '#43d0e3'
        }]
    }

    return (
        <Container>
            <SubMenu url={ROUTES.STAT_CASHBOX_LIST_URL}/>
            <div className={classes.manufactures}>
                <div className={classes.tabWrapper}>
                    {manufactureList}
                </div>
            </div>

            <div className={classes.stats}>
                <div className={classes.statTitle}>
                    <div>Доходы / Расходы</div>
                    <div><a>6 мая 2017 г. - 12 мая 2017 г. <KeyboardArrowDown color="#12aaeb" style={{width: '13px', height: '13px'}}/></a></div>
                </div>
                <Row className={classes.diagram}>
                    <Col xs={9}>
                        <ReactHighcharts config ={config} />
                    </Col>
                    <Col xs={3} className={classes.balanceInfo}>
                        <div className={classes.balance}>
                            <div>Доходы</div>
                            <div>1 000 000 <span>UZS</span></div>
                        </div>
                        <div className={classes.balance}>
                            <div>Расходы</div>
                            <div>- 1 000 000 <span>UZS</span></div>
                        </div>
                        <div className={classes.balance}>
                            <div>Прибыль</div>
                            <div>1 000 000 <span>UZS</span></div>
                        </div>
                    </Col>
                </Row>
                <div className={classes.statTitle}>
                    <div>Расходы по категории</div>
                </div>
                <div className={classes.categoryExpens}>
                    <div style={{width: '250px'}}>
                        <ReactHighcharts config ={configCercle} />
                    </div>
                    <ul className={classes.bulletProof}>
                        <li>
                            <div>
                                <FiberManualRecord />
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                        <li>
                            <div>
                                <FiberManualRecord color="#ff6d65"/>
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                        <li>
                            <div>
                                <FiberManualRecord />
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                        <li>
                            <div>
                                <FiberManualRecord color="#ff6d65"/>
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                        <li>
                            <div>
                                <FiberManualRecord />
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                        <li>
                            <div>
                                <FiberManualRecord color="#ff6d65"/>
                            </div>
                            <div>
                                10% (1 000 000 UZS)<br />Категория
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Dialog
                open={_.get(orderData, 'orderDetailOpen')}
                modal={true}
                onRequestClose={orderData.handleOrderDetailClose}
                bodyClassName={classes.popUp}
                autoScrollBodyContent={true}>
                <StatCashboxOrderDetails
                    key={_.get(orderData, 'id')}
                    data={_.get(orderData, 'orderDetail') || {}}
                    loading={_.get(orderData, 'detailLoading')}
                    handleOrderClick={orderData.handleOrderClick}
                    close={orderData.handleOrderDetailClose}
                />
            </Dialog>
        </Container>
    )
})

StatCashboxGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    orderData: PropTypes.object
}

export default StatCashboxGridList
