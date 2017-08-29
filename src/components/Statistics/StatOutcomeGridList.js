import _ from 'lodash'
import moment from 'moment'
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
import {TextField, DivisionSearchField} from '../ReduxForm'
import StatSideMenu from './StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Person from '../Images/person.png'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../GridList/GridListNavPagination'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import NotFound from '../Images/not-found.png'

export const STAT_OUTCOME_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
    DIVISION: 'division'
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
            height: 'calc(100% - 283px)',
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
        salesSummary: {
            '& > div:first-child': {
                color: '#666'
            },
            '& > div:last-child': {
                fontSize: '24px',
                fontWeight: '600'
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
        form: 'StatOutcomeFilterForm',
        enableReinitialize: true
    }),
)

const StatOutcomeGridList = enhance((props) => {
    const {
        listData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const listLoading = _.get(listData, 'listLoading')

    let sum = 0
    const value = _.map(_.get(listData, 'grafData'), (item) => {
        sum += _.toInteger(_.get(item, 'amount'))
        return _.toInteger(_.get(item, 'amount'))
    })
    const valueName = _.map(_.get(listData, 'grafData'), (item) => {
        return moment(_.get(item, 'date')).format('LL')
    })
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
            data: value,
            color: '#eb9696'

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

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>Категория</Col>
            <Col xs={4}>Описание</Col>
            <Col xs={3}>Кассир</Col>
            <Col xs={2}>Сумма</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const comment = _.get(item, 'comment')
        const amount = _.get(item, 'amount')

        return (
            <Row key={id} className="dottedList">
                <Col xs={1}>{id}</Col>
                <Col xs={2}>Логистика</Col>
                <Col xs={4}>{comment}</Col>
                <Col xs={3}>
                    <div className="personImage"><img src={Person}/></div>
                    <div>Бамбамбиев Куркуда</div>
                </Col>
                <Col xs={2}>{numberFormat(amount, primaryCurrency)}</Col>
            </Row>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_OUTCOME_URL}/>
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
                                <Excel color="#fff" onTouchTap={() => { getDocument.handleGetDocument() }}/>
                                <span>Excel</span>
                            </a>
                        </form>
                        {listLoading
                            ? <div className={classes.loader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                            : (_.isEmpty(list) && !listLoading)
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                  </div>
                                : <div>
                                    <Row className={classes.diagram}>
                                        <Col xs={3} className={classes.salesSummary}>
                                            <div>Сумма продаж за период</div>
                                            <div>{numberFormat(sum)} {primaryCurrency}</div>
                                        </Col>
                                        <Col xs={9}>
                                            <ReactHighcharts config={config}/>
                                        </Col>
                                    </Row>
                                    <div className={classes.pagination}>
                                        <div><b>История расходов</b></div>
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
        </Container>
    )
})

StatOutcomeGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatOutcomeGridList
