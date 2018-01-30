import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import {compose, withState, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import {TextField, AgentSearchField, MarketTypeMultiSearchField} from '../../ReduxForm'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import horizontalScroll from '../../../helpers/horizontalScroll'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel} from '../../Statistics'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen'
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit'
import t from '../../../helpers/translate'
import Market from 'material-ui/svg-icons/maps/store-mall-directory'
import MarketType from 'material-ui/svg-icons/maps/local-mall'
import {hashHistory} from 'react-router'
import ExpandList from 'material-ui/svg-icons/action/list'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    USER: 'user',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate',
    MARKET_TYPE: 'marketType'
}
export const MARKET = 'market'
export const MARKET_TYPE = 'marketType'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0',
            padding: '100px 0',
            background: '#fff',
            zIndex: '30'
        },
        sumLoader: {
            width: '100%',
            margin: '0 !important',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex',
            padding: '0',
            height: '72px'
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
                margin: '0 !important'
            }
        },
        tableRow: {
            '& td:nth-child(odd)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:last-child': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        tableRowExt: {
            '& td:nth-child(even)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:last-child': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        leftTable: {
            color: '#666',
            display: 'table',
            marginLeft: '-30px',
            width: '100%',
            '& > div': {
                '&:nth-child(even)': {
                    backgroundColor: '#f9f9f9'
                },
                display: 'table-row',
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '81px',
                    verticalAlign: 'bottom',
                    '& span': {
                        verticalAlign: 'bottom',
                        padding: '15px 30px',
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    display: 'table-cell',
                    fontWeight: '600',
                    verticalAlign: 'middle',
                    padding: '0 30px'
                }
            }
        },
        container: {
            position: 'relative'
        },
        tableWrapper: {
            display: 'flex',
            margin: '0 -30px',
            paddingLeft: '30px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            '& > div:first-child': {
                zIndex: '20',
                boxShadow: '5px 0 8px -3px #CCC',
                width: '350px'
            },
            '& > div:last-child': {
                alignSelf: 'baseline',
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                minWidth: '220px'
            }
        },
        mainTable: {
            width: '100%',
            minWidth: '950px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '140px'
            }
        },
        title: {
            fontWeight: '600',
            '& tr, td': {
                border: '1px #efefef solid'
            }
        },
        subTitle: {
            extend: 'title',
            '& td:nth-child(odd)': {
                borderRight: 'none'
            },
            '& td:last-child': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
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
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '200px',
            padding: '160px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            zIndex: '20'
        },
        summary: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: 'solid 1px #efefef',
            padding: '15px 0',
            color: '#666',
            '& > div': {
                border: '1px solid #efefef',
                borderRadius: '2px',
                padding: '0 15px',
                paddingBottom: '10px',
                width: 'calc((100% / 3) - 10px)',
                '& div': {
                    fontSize: '17px',
                    color: '#333',
                    fontWeight: '600'
                },
                '& span': {
                    display: 'block',
                    marginTop: '10px'
                },
                '&:last-child': {
                    textAlign: 'right'
                }

            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        details: {
            background: '#fefefe',
            position: 'relative',
            margin: '0 -30px',
            padding: '0 30px',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: '-1px',
                left: '0',
                right: '0',
                background: '#efefef',
                height: '2px',
                zIndex: '9'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-1px',
                left: '0',
                right: '0',
                background: '#efefef',
                height: '2px',
                zIndex: '9'
            },
            '& .row': {
                position: 'relative'
            }
        },
        closeDetail: {
            position: 'absolute',
            cursor: 'pointer',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0'
        },
        expandedTable: {
            background: '#fff',
            padding: '0 10px 0 30px',
            position: 'fixed',
            overflowY: 'auto',
            overflowX: 'hidden',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '100',
            '& > div': {
                margin: '0'
            }
        },
        flexCenter: {
            display: 'flex',
            alignItems: 'center'
        },
        flexSpaceBetween: {
            justifyContent: 'space-between'
        },
        fullScreen: {
            marginLeft: '10px !important'
        },
        toggleWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 0',
            borderTop: '1px #efefef solid',
            '& > div': {
                display: 'flex',
                background: 'transparent !important'
            },
            '& button': {
                height: '32px !important',
                lineHeight: '32px !important',
                minWidth: '66px !important',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            }
        },
        shadowButton: {
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
        },
        leftTableList: {
            '& > span': {
                display: 'flex !important',
                alignItems: 'center',
                minHeight: '39px',
                justifyContent: 'space-between',
                height: '100%'
            }
        },
        filtered: {
            whiteSpace: 'nowrap',
            '& > a': {
                display: 'block',
                fontWeight: '600'
            }
        }
    }),
    withState('currentRow', 'updateRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    withState('currentParent', 'updateCurrentParent', null),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    lifecycle({
        componentDidMount () {
            const horizontalTable = this.refs.horizontalTable
            horizontalScroll(horizontalTable)
        }
    })
)

const listHeader = [
    // Sales
    {
        sorting: true,
        title: t('Сумма'),
        tooltip: t('Общая сумма продаж')
    },
    {
        sorting: true,
        title: t('Фактически'),
        tooltip: t('Сумма продаж с учетом возвратов')
    },
    // Returns
    {
        sorting: true,
        tooltip: t('Сумма возвратов от продаж'),
        title: t('По заказам')
    },
    {
        sorting: true,
        tooltip: t('Сумма возвратов за этот период'),
        title: t('Общее')
    },
    // Payments
    {
        sorting: true,
        title: t('По заказам'),
        tooltip: t('Сумма оплат с заказов')
    },
    // Debt
    {
        sorting: true,
        title: t('По заказам'),
        tooltip: t('Долг по заказов')
    }
]

const StatMarketGridList = enhance((props) => {
    const {
        listData,
        classes,
        filter,
        handleSubmitFilterDialog,
        initialValues,
        getDocument,
        handleSubmit,
        currentRow,
        updateRow,
        expandedTable,
        currentParent,
        updateCurrentParent,
        setExpandedTable,
        handleGetChilds,
        handleResetChilds
    } = props

    const sumData = _.get(listData, 'sumData')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const sumLoading = _.get(listData, 'sumLoading')

    const salesFactSum = _.toNumber(_.get(sumData, 'salesFactSum'))
    const salesTotalSum = _.toNumber(_.get(sumData, 'salesTotalSum'))
    const returnOrdersSum = _.toNumber(_.get(sumData, 'returnOrdersSum'))
    const returnTotalSum = _.toNumber(_.get(sumData, 'returnTotalSum'))
    const paymentOrdersSum = _.toNumber(_.get(sumData, 'paymentOrdersSum'))
    const debtOrdersSum = _.toNumber(_.get(sumData, 'deptOrdersSum'))

    const styleOnHover = {
        background: '#efefef'
    }
    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            minWidth: 40,
            width: 40,
            height: 40,
            padding: 9
        }
    }

    const toggle = filter.getParam('toggle') || MARKET
    const primaryColor = '#12aaeb'
    const disabledColor = '#dadada'
    const whiteColor = '#fff'
    const isMarket = toggle === MARKET
    const isMarketType = toggle === MARKET_TYPE

    const tableLeft = _.map(_.get(listData, 'data'), (item, index) => {
        const name = _.get(item, 'name') || 'No'
        const id = _.get(item, 'id')
        return (
            <div
                key={index}
                onClick={isMarketType && !currentParent
                    ? () => {
                        updateCurrentParent(name)
                        handleGetChilds(id)
                    }
                    : null }
                className={classes.leftTableList}
                style={index === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(index) }}
                onMouseLeave={() => { updateRow(null) }}>
                <span style={isMarketType && !currentParent ? {cursor: 'pointer'} : {}}>
                    {name} {isMarketType && !currentParent && <ExpandList color={'#12aaeb'}/>}
                </span>
            </div>
        )
    })

    const tableList = _.map(_.get(listData, 'data'), (item, index) => {
        const salesFact = _.toNumber(_.get(item, 'salesFact'))
        const salesTotal = _.toNumber(_.get(item, 'salesTotal'))
        const returnOrders = _.toNumber(_.get(item, 'returnOrders'))
        const returnTotal = _.toNumber(_.get(item, 'returnTotal'))
        const paymentOrders = _.toNumber(_.get(item, 'paymentOrders'))
        const deptOrders = _.toNumber(_.get(item, 'deptOrders'))
        const clientName = _.get(item, 'clientName')
        return (
            <tr
                key={index}
                className={isMarket ? classes.tableRow : classes.tableRowExt}
                style={index === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(index) }}
                onMouseLeave={() => { updateRow(null) }}>
                {isMarket && <td>{clientName}</td>}

                <td>{numberFormat(salesTotal, primaryCurrency)}</td>
                <td>{numberFormat(salesFact, primaryCurrency)}</td>
                <td>{numberFormat(returnOrders, primaryCurrency)}</td>
                <td>{numberFormat(returnTotal, primaryCurrency)}</td>
                <td>{numberFormat(paymentOrders, primaryCurrency)}</td>
                <td>{numberFormat(deptOrders, primaryCurrency)}</td>
            </tr>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label={t('Диапазон дат')}
                fullWidth={true}/>
            <Field
                name="marketType"
                component={MarketTypeMultiSearchField}
                className={classes.inputFieldCustom}
                label={t('Тип магазина')}
                fullWidth={true}
            />
            <Field
                name="user"
                component={AgentSearchField}
                className={classes.inputFieldCustom}
                label={t('Агент')}
                fullWidth={true}
            />
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_MARKET_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={STAT_MARKET_FILTER_KEY}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            fields={fields}
                            initialValues={initialValues}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        {sumLoading
                            ? <div className={classes.sumLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <div className={classes.summary}>
                                <div>
                                    <span>{t('Сумма от продаж')}</span>
                                    <div>{numberFormat(salesTotalSum, primaryCurrency)}</div>
                                    <span>{t('Фактические продажи')}</span>
                                    <div>{numberFormat(salesFactSum, primaryCurrency)}</div>
                                </div>

                                <div>
                                    <span>{t('Общий возврат')}</span>
                                    <div>{numberFormat(returnTotalSum, primaryCurrency)}</div>
                                    <span>{t('Возврат по заказам')}</span>
                                    <div>{numberFormat(returnOrdersSum, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>{t('Долг по заказам')}</span>
                                    <div>{numberFormat(debtOrdersSum, primaryCurrency)}</div>
                                    <span>{t('Оплачено по заказам')}</span>
                                    <div>{numberFormat(paymentOrdersSum, primaryCurrency)}</div>
                                </div>
                            </div>}
                        <div className={expandedTable ? classes.expandedTable : ''}>
                            <div className={classes.pagination}>
                                <div>{isMarket ? t('Продажи по магазинам в зоне') : t('Продажи по типам магазинов в зоне')}</div>
                                <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="search"
                                        component={TextField}
                                        hintText={isMarket ? t('Магазин') : t('Тип магазина')}/>
                                </form>
                                <div className={classes.flexCenter}>
                                    <Pagination filter={filter}/>
                                    {expandedTable &&
                                    <ToolTip position="left" text={t('Обычный вид')}>
                                        <IconButton
                                            className={classes.fullScreen}
                                            onTouchTap={() => { setExpandedTable(!expandedTable) }}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}>
                                            <FullScreenExit color="#666"/>
                                        </IconButton>
                                    </ToolTip>}
                                    {!expandedTable &&
                                    <ToolTip position="left" text={t('Расширенный вид')}>
                                        <IconButton
                                            className={classes.fullScreen}
                                            onTouchTap={() => { setExpandedTable(!expandedTable) }}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}>
                                            <FullScreen color="#666"/>
                                        </IconButton>
                                    </ToolTip>}
                                </div>
                            </div>
                            <div>
                                <div className={classes.flexCenter + ' ' + classes.flexSpaceBetween}>
                                    {isMarketType && currentParent &&
                                    <div className={classes.filtered}>
                                        Отфильтровано по: <strong>{currentParent}</strong>
                                        <a onClick={() => {
                                            updateCurrentParent(null)
                                            handleResetChilds()
                                        }}>Сбросить фильтр</a>
                                    </div>}
                                    <div className={classes.toggleWrapper} style={currentParent ? {width: 'auto'} : {width: '100%'}}>
                                    <ToolTip position="left" text="Показать по магазинам">
                                            <FlatButton
                                                icon={<Market color={whiteColor}/>}
                                                className={isMarket ? classes.shadowButton : ''}
                                                onTouchTap={() => {
                                                    updateCurrentParent(null)
                                                    hashHistory.push(filter.createURL({toggle: MARKET}))
                                                }}
                                                backgroundColor={isMarket ? primaryColor : disabledColor}
                                                rippleColor={whiteColor}
                                                hoverColor={isMarket ? primaryColor : disabledColor}/>
                                        </ToolTip>
                                        <ToolTip position="left" text="Показать по типам магазинов">
                                            <FlatButton
                                                icon={<MarketType color={whiteColor}/>}
                                                className={isMarketType ? classes.shadowButton : ''}
                                                onTouchTap={() => {
                                                    updateCurrentParent(null)
                                                    hashHistory.push(filter.createURL({toggle: MARKET_TYPE}))
                                                }}
                                                backgroundColor={isMarketType ? primaryColor : disabledColor}
                                                rippleColor={whiteColor}
                                                hoverColor={isMarketType ? primaryColor : disabledColor}/>
                                        </ToolTip>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.container}>
                                {listLoading && <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>}
                                <div className={classes.tableWrapper}>
                                    <div className={classes.leftTable}>
                                        <div><span>{isMarket ? t('Магазин') : t('Тип магазина')}</span></div>
                                        {tableLeft}
                                    </div>
                                    {_.isEmpty(tableList) && !listLoading &&
                                    <div className={classes.emptyQuery}>
                                        <div>{t('По вашему запросу ничего не найдено')}</div>
                                    </div>}
                                    <div ref="horizontalTable">
                                        <table className={classes.mainTable}>
                                            <tbody className={classes.tableBody}>
                                            <tr className={classes.title}>
                                                {isMarket && <td rowSpan={2}>{t('Клиент')}</td>}
                                                <td colSpan={2}>{t('Продажа')}</td>
                                                <td colSpan={2}>{t('Возврат')}</td>
                                                <td>{t('Оплачено')}</td>
                                                <td>{t('Долг')}</td>
                                            </tr>
                                            <tr className={classes.subTitle}>
                                                {_.map(listHeader, (header, index) => {
                                                    const ZERO = 0
                                                    const ONE = 1
                                                    const EVEN = 2
                                                    const isEven = (index + ONE) % EVEN === ZERO
                                                    const tooltip = _.get(header, 'tooltip')
                                                    const sorting = _.get(header, 'sorting')
                                                    const position = 'left'
                                                    if (tooltip) {
                                                        return (
                                                            <td key={index}>
                                                                <ToolTip text={tooltip} position={position} alignRight={isEven}>{header.title}</ToolTip>
                                                            </td>
                                                        )
                                                    } else if (sorting) {
                                                        if (tooltip) {
                                                            return (
                                                                <td key={index} style={{cursor: 'pointer'}}>
                                                                    <ToolTip text={tooltip} position={position} alignRight={isEven}>{header.title}</ToolTip>
                                                                </td>
                                                            )
                                                        }
                                                        return <td key={index} style={{cursor: 'pointer'}}>{header.title}</td>
                                                    }
                                                    return <td key={index}>{header.title}</td>
                                                })}
                                            </tr>
                                            {tableList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
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
