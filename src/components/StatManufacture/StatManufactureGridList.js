import _ from 'lodash'
import injectSheet from 'react-jss'
import React from 'react'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import {Row, Col} from 'react-flexbox-grid'
import ReactHighcharts from 'react-highcharts'
import GridList from '../GridList'
import Container from '../Container'
import SubMenu from '../SubMenu'
import * as ROUTES from '../../constants/routes'
import StatManufactureCreateDialog from './StatManufactureCreateDialog'
import Glue from '../Images/glue.png'
import Cylindrical from '../Images/cylindrical.png'
import Press from '../Images/press.png'
import Cut from '../Images/cut.png'
import Badge from '../Images/badge.png'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import t from '../../helpers/translate'

const listHeader = [
    {
        sorting: true,
        name: 'name',
        xs: 8,
        title: t('Наименование')
    },
    {
        sorting: true,
        name: 'sum',
        xs: 2,
        title: t('Количество')
    },
    {
        sorting: true,
        xs: 2,
        name: 'time',
        title: t('Эффективность')
    }
]
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
                fontWeight: '700',
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
            fontWeight: '700'
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
            padding: '20px 28px 0',
            borderBottom: '1px #e0e0e0 solid'
        },
        tabWrapper: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
        },
        tab: {
            cursor: 'pointer',
            padding: '20px',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
        },
        activeTab: {
            paddingBottom: '20px',
            flexBasis: '20%',
            marginRight: '15px',
            borderBottom: '3px transparent solid',
            '&:last-child': {
                margin: '0'
            }
        },
        tabTitle: {
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0',
            '& img': {
                width: '24px',
                marginRight: '10px'
            }
        },
        statTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            padding: '20px 0',
            borderBottom: '1px #e0e0e0 solid',
            '& a': {
                fontWeight: '600'
            }
        },
        diagram: {
            padding: '20px 0'
        },
        divEffectBlock: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '20px 0',
            '& div': {
                width: '50%',
                fontSize: '13px',
                fontWeight: 600,
                color: '#666'
            },
            '& h3': {
                fontSize: '36px',
                color: '#333',
                textAlign: 'center'
            },
            '& h3 span': {
                fontSize: '14px'
            },
            '& div div': {
                width: '100%'
            },
            '& div div div': {
                width: '100%'
            }
        }
    }),
)

const StatManufactureGridList = enhance((props) => {
    const {
        filter,
        createDialog,
        listData,
        detailData,
        classes
    } = props

    const detailId = _.get(detailData, 'id')
    const glue = 3
    const cylindrical = 4
    const press = 6
    const cut = 7
    const badge = 8
    const manufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const manufName = _.get(item, 'name')
        return (
        <div key={id} className={classes.activeTab} style={ detailId === id ? {borderBottom: '3px #12aaeb solid'} : {}}>
            <Paper key={id} zDepth={1} className={classes.tab}
                   style={ detailId === id ? {backgroundColor: '#f2f5f8', cursor: 'auto'} : {}}
                   onClick={() => {
                       listData.handleClickItem(id)
                   }}>
                <div className={classes.tabContent}>
                    <div className={classes.tabTitle}>
                        { id === glue ? <img src={Glue}/> : (
                            id === cylindrical ? <img src={Cylindrical}/> : (
                                id === press ? <img src={Press}/> : (
                                    id === cut ? <img src={Cut}/> : (
                                        id === badge ? <img src={Badge}/> : '')
                                )
                            )
                        )}
                        {manufName}
                    </div>

                </div>
            </Paper>
        </div>
        )
    })

    const statManufactureList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = t('Наименование продукта')
        const amount = '1000 шт'
        const efficency = '88%'
        return (
            <Row key={id}>
                <Col xs={8}>{name}</Col>
                <Col xs={2}>{amount}</Col>
                <Col xs={2}>
                    <a className={classes.link} onClick={createDialog.handleOpenCreateDialog}>{efficency}</a>
                </Col>
            </Row>
        )
    })
    const manufName = _.get(detailData, ['data', 'name'])

    const sempl = 1

    const list = {
        header: listHeader,
        list: statManufactureList,
        loading: _.get(listData, 'listLoading')
    }
    const configCercle = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 150,
            margin: ['0', '30', '0', '0']
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
                innerSize: '70%',
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
                data: t('Эффективность'),
                y: 80,
                color: '#028eff'
            }, {
                data: t('Отклонение'),
                y: 20,
                color: '#ccc'
            }]
        }]
    }

    const config = {
        chart: {
            type: 'areaspline',
            height: 350
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
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.1,
                pointPlacement: 'on',
                marker: {
                    enabled: true
                }
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
            pointFormat: '{series.name}: <b>{point.y}</b><br/>' + t('в отношении к BoM') + '<br/>'
        },
        series: [{
            marker: {
                symbol: 'circle'
            },
            name: t('Эффективность'),
            data: [sempl + sempl + sempl + sempl, sempl + sempl + sempl, sempl + sempl + sempl + sempl],
            color: '#7560a5'

        }, {
            marker: {
                symbol: 'circle'
            },
            name: 'BoM',
            data: [sempl + sempl + sempl, sempl + sempl + sempl + sempl, sempl + sempl + sempl],
            color: '#43d0e3'
        }]
    }
    return (
        <Container>
            <SubMenu url={ROUTES.STAT_MANUFACTURE_LIST_URL}/>
            <div className={classes.manufactures}>
                <div className={classes.tabWrapper}>
                    {manufactureList}
                </div>
            </div>

            <div className={classes.stats}>
                <div className={classes.statTitle}>
                    <div>{manufName}</div>
                    <div><a>6 мая 2017 г. - 12 мая 2017 г. <KeyboardArrowDown color="#12aaeb" style={{width: '13px', height: '13px'}}/></a></div>
                </div>
                <Row className={classes.diagram}>
                    <Col xs={9}>
                        <ReactHighcharts config ={config} />
                    </Col>
                    <Col xs={3}>
                        <div style={{background: '#f1f5f8', padding: '25px', height: '82%'}}>
                            <h2>{t('Эффективность')}</h2>
                            <div className={classes.divEffectBlock}>
                                <div><ReactHighcharts config ={configCercle} /></div>
                                <div>% {t('эффективности<br/>относительно BoM')}</div>
                            </div>
                            <div className={classes.divEffectBlock}>
                                <div><h3>1000 <span>кг</span></h3></div>
                                <div>{t('Произведено<br/>за период')}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <GridList
                key={_.get(detailData, 'id')}
                filter={filter}
                list={list}
            />

            <StatManufactureCreateDialog
                open={createDialog.openCreateDialog}
                loading={createDialog.createLoading}
                onClose={createDialog.handleCloseCreateDialog}
            />
        </Container>
    )
})

StatManufactureGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    orderData: PropTypes.object,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool.isRequired,
        openCreateDialog: PropTypes.bool.isRequired,
        handleOpenCreateDialog: PropTypes.func.isRequired,
        handleCloseCreateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatManufactureGridList
