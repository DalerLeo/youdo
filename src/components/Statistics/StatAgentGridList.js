import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import Paper from 'material-ui/Paper'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import UsersSearchField from '../ReduxForm/Users/UsersSearchField'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatAgentDialog from './StatAgentDialog'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Person from '../Images/person.png'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'

export const STAT_AGENT_FILTER_KEY = {
    ZONE: 'zone',
    USER: 'user',
    DATE: 'date'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                margin: '0rem !important'
            }
        },
        tableWrapper: {
            padding: '0 30px',
            '& .row': {
                '& div': {
                    display: 'flex',
                    lineHeight: '55px',
                    alignItems: 'center'

                }
            },
            '& .dottedList': {
                padding: '0',
                '&:after': {
                    margin: '0 -25px'
                },
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                padding: '0!important',
                width: '35px',
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
        excel: {
            backgroundColor: '#6ec790 !important',
            color: '#fff',
            fontWeight: '600',
            padding: '10px 10px',
            borderRadius: '3px',
            lineHeight: '12px',
            cursor: 'pointer'
        },
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        form: {
            display: 'flex',
            alignItems: 'center'
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
            flexBasis: '25%',
            maxWidth: '25%'

        },
        rightPanel: {
            flexBasis: '75%',
            maxWidth: '75%'
        },
        searchButton: {
            marginBottom: '0!important',
            marginLeft: '-25px!important'
        }
    }),
    reduxForm({
        form: 'StatAgentFilterForm',
        enableReinitialize: true
    }),
)

const StatAgentGridList = enhance((props) => {
    const {
        classes,
        statAgentDialog
    } = props

    const headerStyle = {
        backgroundColor: '#5d6474',
        color: '#fff',
        fontWeight: '600'
    }

    const sample = 100
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
            data: [sample + sample + sample + sample],
            color: '#7560a5'

        }, {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: 'BoM',
            data: [sample + sample + sample + sample],
            color: '#43d0e3'
        }]
    }
    const iconStyle = {
        icon: {
            color: '#333',
            width: 25,
            height: 25
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }
    const headers = (
        <Paper
            zDepth={2}
            style={headerStyle}>
            <div className={classes.tableWrapper}>
                <Row>
                    <Col xs={4}>Агенты</Col>
                    <Col xs={5}>Зона</Col>
                    <Col xs={3}>Сумма</Col>
                </Row>
            </div>
        </Paper>

    )
    const list = (
        <Paper zDepth={1} >
            <div className={classes.tableWrapper}>
                <Row className="dottedList">
                    <Col xs={4}>
                        <div className="personImage">
                            <img src={Person} alt=""/>
                        </div>
                        Исаков Тулкин</Col>
                    <Col xs={5}>Ташкент сел маш</Col>
                    <Col xs={2}>100000 UZS</Col>
                    <Col xs={1}>
                        <a onClick={statAgentDialog.handleOpenStatAgentDialog} className={classes.link}>
                            ДЕТАЛИ
                        </a>
                    </Col>
                </Row>
                <Row className="dottedList">
                    <Col xs={4}>Исаков Тулкин</Col>
                    <Col xs={5}>Ташкент сел маш</Col>
                    <Col xs={2}>100000 UZS</Col>
                    <Col xs={1}>ДЕТАЛИ</Col>
                </Row>
            </div>
        </Paper>
    )
    const page = (
            <Paper zDepth={1}
                   style={{margin: '0 -28px'}}>
                <Row style={{margin: '0'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_AGENT_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <form className={classes.form}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="zone"
                                        component={UsersSearchField}
                                        label="Зоны"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="user"
                                        component={UsersSearchField}
                                        label="Агенты"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат."
                                        fullWidth={true}/>
                                </div>
                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit"
                                    >
                                    <Search/>
                                </IconButton>
                            </form>
                            <div className={classes.balanceButtonWrap}>
                                <div className={classes.balanceInfo}>
                                    <span className={classes.balance}>2500 000 UZS</span>
                                    Обшая Сумма от продажи товаров
                                </div>
                                <div className={classes.excel}>
                                    скачать excel
                                </div>
                            </div>
                            <ReactHighcharts config={config}/>
                            {headers}
                            {list}
                        </div>
                    </div>
                </Row>
            </Paper>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.STATISTICS_LIST_URL}/>
            {page}
        <StatAgentDialog
            open={statAgentDialog.openStatAgentDialog}
            onClose={statAgentDialog.handleCloseStatAgentDialog}
        />
        </Container>
    )
})

StatAgentGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statAgentDialog: PropTypes.shape({
        openStatAgentDialog: PropTypes.bool.isRequired,
        handleOpenStatAgentDialog: PropTypes.func.isRequired,
        handleCloseStatAgentDialog: PropTypes.func.isRequired
    })
}

export default StatAgentGridList
