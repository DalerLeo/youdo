/* eslint-disable no-shadow */
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {CashboxSearchField, DivisionSearchField} from '../../ReduxForm/index'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import Tooltip from '../../ToolTip/index'
import Person from '../../Images/person.png'
import ReactHighcharts from 'react-highcharts'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import CashboxDetails from './StatCashboxDetails'
import getConfig from '../../../helpers/getConfig'

export const STAT_CASHBOX_FILTER_KEY = {
    CASHBOX: 'cashbox',
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
        cashboxWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '45px'
        },
        cashbox: {
            marginRight: '45px',
            width: 'calc((100% / 3) - 30px)',
            '&:nth-child(3n+3)': {
                margin: '0'
            }
        },
        cashboxTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '5px',
            borderBottom: '1px #efefef solid',
            '& > div:first-child': {
                fontWeight: 'bold',
                '& a': {
                    fontWeight: 'inherit',
                    color: 'inherit'
                }
            },
            '& > div:last-child': {
                color: '#666'
            }
        },
        cashboxFooter: {
            extend: 'cashboxTitle',
            '& > div': {
                lineHeight: '15px'
            },
            '& > div:last-child': {
                color: '#333 !important',
                textAlign: 'right'
            }
        },
        cashboxBalance: {
            '& > div:first-child': {
                color: '#666',
                fontSize: '11px',
                fontWeight: '600 !important'
            }
        },
        avatar: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden',
            '& img': {
                width: '100%',
                height: '100%'
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
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden',
            position: 'relative'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        balances: {
            display: 'flex',
            padding: '20px 0',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        balanceItem: {
            marginRight: '50px',
            '& span': {
                color: '#666',
                marginBottom: '5px'
            },
            '& div': {
                fontSize: '24px',
                fontWeight: '600'
            },
            '&:last-child': {
                marginRight: '0'
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
        form: 'StatCashboxFilterForm',
        enableReinitialize: true
    }),
)
let arr = []
for (let i = 0, t = 20; i < t; i++) {
    arr.push(Math.round(Math.random() * t))
}

const StatCashboxGridList = enhance((props) => {
    const {
        filter,
        listData,
        detailData,
        classes,
        getDocument,
        handleSubmitFilterDialog
    } = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const listLoading = _.get(listData, 'listLoading')
    const openDetails = _.get(listData, 'openDetails')
    const startBalance = _.get(listData, ['sumData', 'startBalance'])
    const endBalance = _.get(listData, ['sumData', 'endBalance'])
    const income = _.get(listData, ['sumData', 'income'])
    const expense = _.get(listData, ['sumData', 'expense'])

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
    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const bank = 1
        const name = _.get(item, 'name')
        const currency = _.get(item, ['currency', 'name'])
        const balance = numberFormat(_.get(item, 'balance'), currency)
        const cashierFirstName = _.get(item, ['cashier', 'firstName'])
        const cashierSecondName = _.get(item, ['cashier', 'secondName'])
        const cashier = cashierFirstName + ' ' + cashierSecondName
        const type = _.toInteger(_.get(item, 'type')) === bank ? 'банковский счет' : 'наличные'
        const ZERO = 0
        const TEN = 10
        const config = {
            chart: {
                type: 'area',
                height: 100,
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
                valueSuffix: ' ' + currency,
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
                data: arr,
                color: '#3aa8c6'

            }]
        }

        return (
            <div className={classes.cashbox} key={id}>
                <div className={classes.cashboxTitle}>
                    <div>
                        <Link to={{
                            pathname: sprintf(ROUTES.STATISTICS_CASHBOX_ITEM_PATH, id),
                            query: filter.getParams()
                        }}>{name}</Link>
                    </div>
                    <div>{type}</div>
                </div>
                <div>
                    <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
                </div>
                <div className={classes.cashboxFooter}>
                    <div className={classes.cashboxBalance}>
                        <div>Баланс</div>
                        <div>{balance}</div>
                    </div>
                    <Tooltip position="left" text={cashier}>
                        <div className={classes.avatar}>
                            <img src={Person} alt=""/>
                        </div>
                    </Tooltip>
                </div>
            </div>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_CASHBOX_URL}/>
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
                                        name="cashbox"
                                        component={CashboxSearchField}
                                        label="Кассы"
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
                            : _.isEmpty(list)
                                 ? <div className={classes.emptyQuery}>
                                     <div>По вашему запросу ничего не найдено</div>
                                   </div>
                                 : <div>
                                     <div className={classes.balances}>
                                         <div className={classes.balanceItem}>
                                             <span>Баланс на начало периода</span>
                                             <div>{numberFormat(startBalance, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Расход за период</span>
                                             <div>{numberFormat(expense, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Доход за период</span>
                                             <div>{numberFormat(income, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Баланс на конец периода</span>
                                             <div>{numberFormat(endBalance, primaryCurrency)}</div>
                                         </div>
                                     </div>
                                     <div className={classes.cashboxWrapper}>
                                        {list}
                                     </div>
                                 </div>}
                        </div>

                    {openDetails && <CashboxDetails
                        filter={filter}
                        detailData={detailData}
                        listData={listData}
                        handleSubmitFilterDialog={_.get(detailData, 'handleSubmitDetailFilterDialog')}
                        getDocument={getDocument}
                    />}
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

StatCashboxGridList.propTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleSubmitFilterDialog: PropTypes.func,
    getDocument: PropTypes.object
}

export default StatCashboxGridList
