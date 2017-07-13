import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import ClientSearchField from '../ReduxForm/Client/ClientSearchField'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/svg-icons/action/list'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import StatFinanceDialog from './StatFinanceDialog'

export const STAT_FINANCE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    USER: 'user'
}

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% - 32px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
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
            maxWidth: 'calc(100% - 250px)'
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
        salesSummary: {
            '& > div:first-child': {
                color: '#666'
            },
            '& > div:last-child': {
                fontSize: '24px',
                fontWeight: '600'
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
        classes,
        filter,
        handleSubmitFilterDialog,
        statFinanceDialog
    } = props

    const sample = 100
    const deletion = 3
    const config = {
        chart: {
            type: 'areaspline',
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
            data: [sample, sample + (sample / deletion), sample, deletion * sample / deletion, sample * deletion],
            color: '#6cc6de'

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
            <Col xs={4}>Клиент</Col>
            <Col xs={3}>Сумма</Col>
        </Row>
    )

    const list = (
        <Row className="dottedList">
            <Col xs={2}>158</Col>
            <Col xs={2}>22.08.2017</Col>
            <Col xs={4}>Имя Фамилия Клиента</Col>
            <Col xs={3} style={{justifyContent: 'flex-end'}}>3 000 000 UZS</Col>
            <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                <IconButton
                    onTouchTap={statFinanceDialog.handleOpenStatFinanceDialog}>
                    <List color="#12aaeb"/>
                </IconButton>
            </Col>
        </Row>
    )

    const page = (
            <div className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_FINANCE_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="client"
                                        component={ClientSearchField}
                                        label="Клиенты"
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
                                    <div>Сумма продаж за период</div>
                                    <div>35 000 000 UZS</div>
                                </Col>
                                <Col xs={9}>
                                    <ReactHighcharts config={config}/>
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
                        </div>
                    </div>
                </Row>
            </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STATISTICS_LIST_URL}/>
            {page}
            <StatFinanceDialog
                open={statFinanceDialog.openStatFinanceDialog}
                onClose={statFinanceDialog.handleCloseStatFinanceDialog}
            />
        </Container>
    )
})

StatFinanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statFinanceDialog: PropTypes.shape({
        openStatFinanceDialog: PropTypes.bool.isRequired,
        handleCloseStatFinanceDialog: PropTypes.func.isRequired,
        handleOpenStatFinanceDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatFinanceGridList
