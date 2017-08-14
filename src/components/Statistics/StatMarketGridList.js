import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import LinearProgress from 'material-ui/LinearProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {TextField, DivisionSearchField} from '../ReduxForm'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatSideMenu from './StatSideMenu'
import LinearLoading from '../LinearProgress'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import StatMarketDialog from './StatMarketDialog'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import ReactHighcharts from 'react-highcharts'
import NotFound from '../Images/not-found.png'
import dateFormat from '../../helpers/dateFormat'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    DIVISION: 'division',
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
                marginTop: '10px',
                borderTop: '1px #efefef solid',
                borderBottom: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            height: 'calc(100% - 140px)',
            overflowY: 'auto',
            overflowX: 'hidden',
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
        filterItem,
        statMarketDialog,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const graphLoading = _.get(detailData, ['graphLoading'])
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    let sum = 0
    const value = _.map(_.get(detailData, ['graphList']), (item) => {
        sum += _.toInteger(_.get(item, 'amount'))
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
            valueSuffix: ' ' + getConfig('PRIMARY_CURRENCY'),
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
            <Col xs={3}>Клиент</Col>
            <Col xs={3}>Продажи</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const percent = _.get(item, 'percent')
        const clientName = _.get(item, 'clientName')
        const income = numberFormat(_.get(item, 'income'), getConfig('PRIMARY_CURRENCY'))

        if (id === _.get(detailData, 'id')) {
            return (
                <div key={id}>
                    <Row>
                        <Col xs={3}>
                            <img src="http://www.shop-script.su/images/internet-biznes/market-store-icon.jpg" alt=""/>
                            <span>{name}</span>
                        </Col>
                        <Col xs={3}>{clientName}</Col>
                        <Col xs={3}>
                            <LinearProgress
                                color="#58bed9"
                                mode="determinate"
                                value={percent}
                                style={{backgroundColor: '#fff', height: '10px'}}/>
                        </Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{income}</Col>
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
            <Row key={id} className="dottedList">
                <Col xs={3}>
                    <img src="http://www.shop-script.su/images/internet-biznes/market-store-icon.jpg" alt=""/>
                    <span>{name}</span>
                </Col>
                <Col xs={3}>{clientName}</Col>
                <Col xs={3}>
                    <LinearProgress
                        color="#58bed9"
                        mode="determinate"
                        value={percent}
                        style={{backgroundColor: '#fff', height: '10px'}}/>
                </Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{income}</Col>
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
                    {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : <div className={classes.wrapper}>
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
                            <div className={classes.summary}>Сумма от продаж
                                <div>
                                    {numberFormat(sum, 'SUM')}
                                </div>
                            </div>
                            <div className={classes.pagination}>
                                <div>Продажи по магазинам в зоне</div>
                                <Pagination filter={filter}/>
                            </div>
                            {(_.isEmpty(list) && !listLoading) ? <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>
                                : <div className={classes.tableWrapper}>
                                    {headers}
                                    {list}
                                </div>}
                        </div>
                    }
                </div>
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatMarketDialog
                loading={detailData.detailLoading}
                detailData={detailData}
                open={statMarketDialog.openStatMarketDialog}
                onClose={statMarketDialog.handleCloseStatMarketDialog}
                filterItem={filterItem}
            />
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
