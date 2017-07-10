import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import Paper from 'material-ui/Paper'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import ReactHighcharts from 'react-highcharts'
import ProductTypeSearchField from '../ReduxForm/Product/ProductTypeSearchField'
import ProductSearchField from '../ReduxForm/Product/ProductSearchField'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import StatSideMenu from './StatSideMenu'
import SubMenu from '../SubMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Pagination from '../GridList/GridListNavPagination'

export const STAT_PRODUCT_FILTER_KEY = {
    PRODUCT: 'product',
    PRODUCT_TYPE: 'productType',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            margin: '0 -28px',
            minHeight: 'calc(100% - 32px)'
        },
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                margin: '0rem !important',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        tableWrapper: {
            padding: '0 30px',
            '& .row': {
                '& div': {
                    lineHeight: '55px'
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
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)'
        },
        searchButton: {
            marginBottom: '0!important',
            marginLeft: '-25px!important'
        }
    }),
    reduxForm({
        form: 'StatProductFilterForm',
        enableReinitialize: true
    }),
)

const StatProductGridList = enhance((props) => {
    const {
        classes,
        filter
    } = props

    const headerStyle = {
        backgroundColor: '#5d6474',
        color: '#fff',
        fontWeight: '600'
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
    const headers = (
        <Paper
            zDepth={2}
            style={headerStyle}>
            <div className={classes.tableWrapper}>
                <Row>
                    <Col xs={8}>Название</Col>
                    <Col xs={2}>Себестоимость</Col>
                    <Col xs={2}>Цена</Col>
                </Row>
            </div>
        </Paper>

    )
    const list = (
        <Paper zDepth={1} >
            <div className={classes.tableWrapper}>
                <Row className="dottedList">
                    <Col xs={8}>Миф морозная свежесть</Col>
                    <Col xs={2}>Стиралны</Col>
                    <Col xs={2}>5000 - 100000 UZS</Col>
                </Row>
                <Row className="dottedList">
                    <Col xs={8}>Миф морозная свежесть</Col>
                    <Col xs={2}>Стиралны</Col>
                    <Col xs={2}>5000 - 100000 UZS</Col>
                </Row>
            </div>
        </Paper>
    )

    const page = (
    <Paper zDepth={1} className={classes.mainWrapper}>
        <Row style={{margin: '0'}}>
            <div className={classes.leftPanel}>
                <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_URL} />
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.wrapper}>
                    <form className={classes.form}>
                        <div className={classes.filter}>
                            <Field
                                className={classes.inputFieldCustom}
                                name="productType"
                                component={ProductTypeSearchField}
                                label="Тип товара"
                                fullWidth={true}/>
                            <Field
                                className={classes.inputFieldCustom}
                                name="product"
                                component={ProductSearchField}
                                label="Товар"
                                fullWidth={true}/>
                            <Field
                                className={classes.inputFieldCustom}
                                name="date"
                                component={DateToDateField}
                                label="Диапазон дат."
                                fullWidth={true}/>
                        </div>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            className={classes.searchButton}
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
                    <Pagination filter={filter}/>
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
        </Container>
    )
})

StatProductGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatProductGridList
