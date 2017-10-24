import _ from 'lodash'
import React from 'react'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import Loader from '../Loader'
import Person from '../Images/person.png'
import Deals from 'material-ui/svg-icons/social/whatshot'
import Returns from 'material-ui/svg-icons/content/reply-all'
import Visits from 'material-ui/svg-icons/maps/place'
import Reports from 'material-ui/svg-icons/action/assignment'
import Payments from 'material-ui/svg-icons/editor/monetization-on'
import Delivery from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/editor/attach-money'
import Checked from 'material-ui/svg-icons/toggle/check-box'
// Uncomment it when needed ... import Indeterminate from 'material-ui/svg-icons/toggle/indeterminate-check-box'
// Uncomment it when needed ... import CheckOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank'
import Agent from '../Images/agent.png'
import NotFound from '../Images/not-found.png'
import Tooltip from '../ToolTip'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import dateFormat from '../../helpers/dateFormat'
import {Link} from 'react-router'
import * as ROUTE from '../../constants/routes'
import sprintf from 'sprintf'

const ORDER = 2
const formattedType = {
    1: 'Посещение магазина',
    2: 'Оформление заказа',
    3: 'Отправить отчет',
    4: 'Возврат заказа',
    5: 'Оплата',
    6: 'Доставить товар'
}

const timelineColor = '#22a6c6'
const enhance = compose(
    injectSheet({
        padding: {
            padding: '20px 30px'
        },
        link: {
            fontWeight: '600'
        },
        loader: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        headerLoader: {
            background: '#fff',
            border: '1px #e9e9e9 solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '132px'
        },
        plansLoader: {
            extend: 'loader',
            background: '#fff',
            border: '1px #e9e9e9 solid',
            height: '210px'
        },
        wrapper: {
            background: '#f4f4f4 !important',
            borderLeft: '1px #e0e0e0 solid',
            width: 'calc(100% - 330px)',
            extend: 'padding',
            zIndex: '2',
            '& > div': {
                height: '100%'
            }
        },
        agentInfo: {
            border: '1px #e9e9e9 solid',
            position: 'relative',
            boxShadow: '0px 8px 20px 10px #f4f4f4',
            zIndex: '10',
            '& > div': {
                padding: '15px 20px',
                height: '65px'
            }
        },
        header: {
            background: '#e3e3e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& button > div': {
                display: 'flex',
                alignItems: 'center'
            }
        },
        info: {
            '& > span': {
                textAlign: 'right',
                display: 'block',
                '&:last-child': {
                    fontWeight: '600'
                }
            }
        },
        infoAgent: {
            '& > span': {
                display: 'block',
                textAlign: 'right'
            }
        },
        agent: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600',
            '& img': {
                borderRadius: '50%',
                width: '32px',
                minWidth: '32px',
                height: '32px',
                marginRight: '10px'
            }
        },
        salesSummary: {
            '& span': {
                display: 'inline-block',
                '&:last-child': {
                    marginLeft: '10px',
                    textAlign: 'right'
                }
            }
        },
        achieves: {
            extend: 'header',
            background: '#fff'
        },
        subAchieves: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                lineHeight: '1',
                userSelect: 'none',
                marginRight: '30px',
                '& span': {
                    display: 'block',
                    color: '#666',
                    fontWeight: '600',
                    '&:first-child': {
                        fontSize: '18px !important'
                    },
                    '& small': {
                        fontSize: '13px'
                    }
                },
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        warning: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                '&:last-child': {
                    display: 'block'
                },
                '& span': {
                    display: 'block',
                    color: '#666',
                    fontWeight: '600',
                    '&:first-child': {
                        fontWeight: 'normal !important'
                    },
                    '& big': {
                        fontSize: '18px',
                        fontWeight: '600'
                    }
                }
            }
        },
        slash: {
            margin: '0 15px',
            '& > div': {
                width: '2px',
                height: '35px',
                background: '#666',
                transform: 'rotate(15deg)'
            }
        },
        timelineWrapper: {
            margin: '0 -30px',
            padding: ' 20px 30px 0',
            height: 'calc(100% - 130px)',
            overflowY: 'auto',
            position: 'relative',
            '&:after': {
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(244,244,244,1)' +
                ' 80%,rgba(244,244,244,1) 100%)',
                content: '""',
                position: 'fixed',
                bottom: '0',
                right: '0',
                left: '415px',
                height: '50px',
                zIndex: '6'
            },
            '&::-webkit-scrollbar': {
                width: '0'
            }
        },
        timeline: {
            position: 'relative',
            marginTop: '10px',
            padding: '0 25px 20px'
        },
        timelineBlockWrapper: {
            '& > div:first-child': {
                '&:before': {
                    height: 'calc(100% + 43px)',
                    bottom: '-23px',
                    top: 'auto'
                }
            },
            '& > div:last-child': {
                '&:before': {
                    height: 'calc(100% + 5px)'
                }
            }
        },
        timelineDate: {
            background: timelineColor,
            color: '#fff',
            fontWeight: '600',
            borderRadius: '2px',
            margin: '0 auto 30px',
            width: '110px',
            textAlign: 'center',
            padding: '6px 0'
        },
        timelineDatePassive: {
            extend: 'timelineDate',
            background: '#ccc',
            color: '#fff'
        },
        timelineBlock: {
            position: 'relative',
            marginBottom: '10px',
            '&:before': {
                content: '""',
                position: 'absolute',
                left: 'calc(50% - 2px)',
                top: '15px',
                width: '4px',
                height: 'calc(100% + 8px)',
                background: timelineColor
            },
            '&:nth-child(even)': {
                '& > div:last-child': {
                    float: 'right',
                    textAlign: 'left',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: '15px',
                        left: '-13px',
                        right: 'auto',
                        borderTop: '8px solid transparent',
                        borderLeft: 'none',
                        borderRight: '11px solid rgba(0, 0, 0, 0.25)',
                        borderBottom: '8px solid transparent',
                        filter: 'blur(1px)',
                        zIndex: '1'
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: '13px',
                        right: 'auto',
                        left: '-12px',
                        borderTop: '10px solid transparent',
                        borderRight: '12px solid #fff',
                        borderLeft: 'none',
                        borderBottom: '10px solid transparent',
                        zIndex: '3'
                    },
                    '& li': {
                        justifyContent: 'flex-end',
                        flexDirection: 'row-reverse',
                        '& svg': {
                            marginLeft: '0',
                            marginRight: '10px'
                        }
                    },
                    '& > span': {
                        right: 'auto',
                        left: '-95px'
                    }
                },
                '&:after': {
                    content: '""',
                    display: 'table',
                    clear: 'both'
                }
            },
            '&:last-child': {
                marginBottom: '0'
            }
        },
        timelineBlockPassive: {
            extend: 'timelineBlock',
            '&:before': {
                background: '#ccc'
            },
            '& > div:first-child': {
                background: '#ccc'
            }
        },
        timelineDot: {
            background: timelineColor,
            width: '16px',
            height: '16px',
            top: '15px',
            left: 'calc(50% - 8px)',
            position: 'absolute',
            borderRadius: '50%',
            outline: '2px #f4f4f4 solid'
        },
        timelineContent: {
            borderRadius: '2px',
            background: '#fff',
            color: '#666 !important',
            padding: '15px 20px',
            position: 'relative',
            width: 'calc(50% - 30px)',
            zIndex: '3',
            textAlign: 'right',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: '15px',
                right: '-13px',
                borderTop: '8px solid transparent',
                borderLeft: '11px solid rgba(0, 0, 0, 0.25)',
                borderBottom: '8px solid transparent',
                filter: 'blur(1px)',
                zIndex: '1'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '13px',
                right: '-12px',
                borderTop: '10px solid transparent',
                borderLeft: '12px solid #fff',
                borderBottom: '10px solid transparent',
                zIndex: '3'
            },
            '& h2': {
                fontSize: '16px',
                lineHeight: '14px',
                marginBottom: '10px'
            },
            '& li': {
                lineHeight: '25px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '600',
                justifyContent: 'flex-end',
                '& span': {
                    marginLeft: '5px'
                },
                '& a': {
                    fontWeight: 'inherit'
                },
                '& svg': {
                    width: '20px !important',
                    height: '20px !important',
                    marginLeft: '10px'
                }
            },
            '& > span': {
                position: 'absolute',
                top: '12px',
                right: '-95px',
                fontSize: '16px !important',
                fontWeight: 'bold'
            }
        },
        noAgent: {
            backgroundSize: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            color: '#999',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                zIndex: '10'
            },
            '& img': {
                width: '180px',
                opacity: '0.8',
                margin: 'auto'
            },
            '& span': {
                display: 'block',
                fontSize: '17px !important',
                marginTop: '10px'
            }
        },
        emptyQuery: {
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '200px',
            border: '1px #e9e9e9 solid',
            padding: '170px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        }
    })
)

const PlanDetails = enhance((props) => {
    const {
        classes,
        detailData,
        planSalesDialog,
        calendar,
        monthlyPlan,
        agentPlans
    } = props

    const ZERO = 0
    const plansLoading = _.get(agentPlans, 'loading')
    const agentLoading = _.get(detailData, 'detailLoading')
    const monthlyPlanLoading = _.get(monthlyPlan, 'monthlyPlanLoading')
    const isOpenDetails = _.get(detailData, 'openDetail')
    const firstName = _.get(detailData, ['data', 'firstName'])
    const secondName = _.get(detailData, ['data', 'secondName'])
    const position = _.get(detailData, ['data', 'position', 'name'])

    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedDate = dateFormat(_.get(calendar, 'selectedDate'))
    const selectedMonth = moment(_.get(calendar, 'selectedDate'))
    const selectedYear = moment(_.get(calendar, 'selectedDate')).format('YYYY')

    const achieveIcon = {
        basic: {
            color: '#999',
            width: 32,
            minWidth: 32,
            height: 32,
            marginRight: 5
        },
        sales: {
            width: 32,
            minWidth: 32,
            height: 32,
            color: '#999'
        }
    }

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const factSales = _.get(monthlyPlan, ['data', 'factPrice']) && _.toNumber(_.get(monthlyPlan, ['data', 'factPrice']))
    const planAmount = _.sumBy(_.get(monthlyPlan, 'monthlyPlanItem'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const agentHoverText = position + '<br> Наименование зоны'
    const monthlyPlanTooltip = _.join(_.map(_.get(monthlyPlan, 'monthlyPlanItem'), (item) => {
        const division = _.get(item, ['division', 'name'])
        const amount = numberFormat(_.get(item, 'amount'), primaryCurrency)
        return '<div>' + division + ' - ' + amount + '</div>'
    }), ' ')
    return (
        <div className={classes.wrapper}>
            {isOpenDetails
                ? <div>
                    {(agentLoading || monthlyPlanLoading)
                        ? <div className={classes.headerLoader}>
                            <Loader size={0.75}/>
                        </div>
                        : <div className={classes.agentInfo}>
                            <div className={classes.header}>
                                <Tooltip position="bottom" text={agentHoverText}>
                                    <div className={classes.agent}>
                                        <img src={Person} alt=""/>
                                        <div>{secondName} <br/> {firstName}</div>
                                    </div>
                                </Tooltip>
                                <div className={classes.warning}>
                                    <div>
                                        <Money style={achieveIcon.basic}/>
                                        <div>
                                            <span>факт. продажи</span>
                                            <span><big>{numberFormat(factSales)}</big> {primaryCurrency}</span>
                                        </div>
                                    </div>
                                    <div className={classes.slash}>
                                        <div>{null}</div>
                                    </div>
                                    <div>
                                        <span>план продаж</span>
                                        {planAmount > ZERO
                                            ? <Tooltip position="bottom" text={monthlyPlanTooltip}>
                                                <a className={classes.link} onClick={planSalesDialog.handleOpenPlanSales}><big>{numberFormat(planAmount)}</big> {primaryCurrency}</a>
                                            </Tooltip>
                                            : <a className={classes.link} onClick={planSalesDialog.handleOpenPlanSales}>добавить</a>
                                        }
                                    </div>
                                </div>
                                <div className={classes.info}>
                                    <span>Данные за</span>
                                    <span style={{textTransform: 'capitalize'}}>{monthFormat(selectedMonth)} {selectedYear}г.</span>
                                </div>
                            </div>
                            <div className={classes.achieves}>
                                <div className={classes.subAchieves}>
                                    <Tooltip position="bottom" text={'нал: 7 800 USD <br> пер: 2 200 USD'}>
                                        <Deals style={achieveIcon.basic}/>
                                        <div>
                                            <span>10 000 <small>USD</small></span>
                                            <span>сделки</span>
                                        </div>
                                    </Tooltip>
                                    <Tooltip position="bottom" text={'нал: 8 000 USD <br> пер: 4 000 USD'}>
                                        <Payments style={achieveIcon.basic}/>
                                        <div>
                                            <span>12 000 <small>USD</small></span>
                                            <span>оплаты</span>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div className={classes.subAchieves}>
                                    <div>
                                        <Visits style={achieveIcon.basic}/>
                                        <div>
                                            <span>16 / 42</span>
                                            <span>посещено</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Reports style={achieveIcon.basic}/>
                                        <div>
                                            <span>3 / 3</span>
                                            <span>отчеты</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Delivery style={achieveIcon.basic}/>
                                        <div>
                                            <span>4 / 12</span>
                                            <span>доставки</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Returns style={achieveIcon.basic}/>
                                        <div>
                                            <span>3</span>
                                            <span>возвраты</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}

                    <div className={classes.timelineWrapper}>
                        {plansLoading
                            ? <div className={classes.plansLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : (!_.isEmpty(agentPlans.data))
                                ? <div className={classes.timeline}>
                                    <div className={classes.timelineDate}>{selectedDate}</div>
                                    <div className={classes.timelineBlockWrapper}>
                                        {_.map(_.get(agentPlans, 'data'), (item) => {
                                            const id = _.get(item, 'id')
                                            const market = _.get(item, ['market', 'name'])
                                            const planTasks = _.get(item, 'planTasks')
                                            const hasPlanTasks = !_.isEmpty(planTasks)
                                            const time = moment(_.get(_.head(planTasks), 'completedDate')).format('HH:mm')
                                            const tasks = _.map(planTasks, (task, index) => {
                                                const type = _.get(task, 'type')
                                                const orderInfo = _.get(task, 'order')
                                                const info = type === ORDER
                                                    ? <span>(<Link target="_blank" to={{
                                                        pathname: sprintf(ROUTE.ORDER_ITEM_PATH, orderInfo.id),
                                                        query: {search: orderInfo.id}
                                                    }}>№{orderInfo.id}</Link> - {numberFormat(orderInfo.totalPrice, primaryCurrency)})</span>
                                                    : <span></span>
                                                return (
                                                    <li key={index}>{formattedType[type]} {info} <Checked
                                                        color="#92ce95"/>
                                                    </li>
                                                )
                                            })

                                            return (
                                                <div key={id} className={classes.timelineBlock}>
                                                    <div className={classes.timelineDot}>
                                                    </div>

                                                    <Paper className={classes.timelineContent}>
                                                        <h2>{market}</h2>
                                                        {hasPlanTasks
                                                            ? <ul>
                                                                {tasks}
                                                            </ul>
                                                            : <div>Пока не выполнено заданий</div>}
                                                        {hasPlanTasks && <span className={classes.date}>{time}</span>}
                                                    </Paper>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                : <div className={classes.emptyQuery}>
                                    <div>Для выбранного агента в эту дату не найдено планов</div>
                                </div>}
                    </div>
                </div>
                : <div className={classes.noAgent}>
                    <div>
                        <img src={Agent} alt=""/>
                        <span>Для отображения статистики <br/> выберите агента</span>
                    </div>
                </div>}
        </div>
    )
})

PlanDetails.PropTypes = {
    filter: PropTypes.object,
    detailData: PropTypes.object,
    planSalesDialog: PropTypes.shape({
        openPlanSales: PropTypes.bool.isRequired,
        handleOpenPlanSales: PropTypes.func.isRequired,
        handleClosePlanSales: PropTypes.func.isRequired
    }).isRequired
}

export default PlanDetails
