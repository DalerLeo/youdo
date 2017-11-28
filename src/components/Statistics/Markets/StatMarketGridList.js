import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import {compose, withState, lifecycle} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import {TextField, AgentSearchField} from '../../ReduxForm'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import horizontalScroll from '../../../helpers/horizontalScroll'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel} from '../../Statistics'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    USER: 'user',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
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
            height: '75px'
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
                marginTop: '10px'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableRow: {
            '& td:nth-child(odd)': {
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
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                minWidth: '220px'
            },
            '& tr:first-child > td:first-child': {
                verticalAlign: 'bottom',
                padding: '0 20px 15px'
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
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        summary: {
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: 'solid 1px #efefef',
            borderBottom: 'solid 1px #efefef',
            padding: '14px 0',
            color: '#666',
            '& > div': {
                '& div': {
                    fontSize: '20px',
                    color: '#333',
                    fontWeight: '600'
                },
                '& span': {
                    display: 'block'
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
        }
    }),
    withState('currentRow', 'updateRow', null),
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
        title: 'Сумма'
    },
    {
        sorting: true,
        title: 'Фактически'
    },
    // Returns
    {
        sorting: true,
        title: 'По периоду'
    },
    {
        sorting: true,
        title: 'Общее'
    },
    // Payments
    {
        sorting: true,
        title: 'По периоду'
    },
    {
        sorting: true,
        title: 'Общее'
    },
    // Plan
    {
        sorting: true,
        title: 'По периоду'
    },
    {
        sorting: true,
        title: 'Общее'
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
        updateRow
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const sumIncome = _.get(listData, ['sumData', 'income'])
    const sumFact = _.get(listData, ['sumData', 'fact'])
    const sumReturn = _.get(listData, ['sumData', 'returnSum'])
    const paid = _.get(listData, ['sumData', 'paid']) || ''
    const dept = _.get(listData, ['sumData', 'dept'])
    const sumLoading = _.get(listData, 'sumLoading')

    const styleOnHover = {
        background: '#efefef'
    }
    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name') || 'No'
        return (
            <div
                key={id}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <span>{name}</span>
            </div>
        )
    })
    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const income = _.toNumber(_.get(item, 'income'))
        const actual = _.toNumber(_.get(item, 'actualSales'))
        const paidItem = _.get(item, 'paid')
        const deptItem = _.get(item, 'dept')
        const returns = _.toNumber(_.get(item, 'orderReturns'))
        const clientName = _.get(item, 'clientName')

        return (
            <tr
                key={id}
                className={classes.tableRow}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <td>{clientName}</td>

                <td>{numberFormat(income, primaryCurrency)}</td>
                <td>{numberFormat(returns, primaryCurrency)}</td>
                <td>{numberFormat(actual, primaryCurrency)}</td>
                <td>{numberFormat(paidItem, primaryCurrency)}</td>
                <td>{numberFormat(deptItem, primaryCurrency)}</td>

                <td>{numberFormat(deptItem, primaryCurrency)}</td>
                <td>{numberFormat(deptItem, primaryCurrency)}</td>
                <td>{numberFormat(deptItem, primaryCurrency)}</td>
            </tr>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label="Диапазон дат"
                fullWidth={true}/>
            <Field
                name="user"
                component={AgentSearchField}
                className={classes.inputFieldCustom}
                label="Агент"
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
                                    <span>Сумма от продаж</span>
                                    <div>{numberFormat(sumIncome, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Фактические продажи</span>
                                    <div>{numberFormat(sumFact, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Сумма возвратов</span>
                                    <div>{numberFormat(sumReturn, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Оплачено</span>
                                    <div>{numberFormat(paid, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Долг</span>
                                    <div>{numberFormat(dept, primaryCurrency)}</div>
                                </div>
                            </div>}
                        <div className={classes.pagination}>
                            <div>Продажи по магазинам в зоне</div>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText="Магазин"/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        <div className={classes.container}>
                            {listLoading && <div className={classes.loader}>
                                <Loader size={0.75}/>
                            </div>}
                            <div className={classes.tableWrapper}>
                                <div className={classes.leftTable}>
                                    <div><span>Товар</span></div>
                                    {tableLeft}
                                </div>
                                {_.isEmpty(tableList) && !listLoading &&
                                <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>}
                                <div ref="horizontalTable">
                                    <table className={classes.mainTable}>
                                        <tbody className={classes.tableBody}>
                                        <tr className={classes.title}>
                                            <td rowSpan={2}>Тип</td>
                                            <td colSpan={2}>Продажа</td>
                                            <td colSpan={2}>Возврат</td>
                                            <td colSpan={2}>Оплачено</td>
                                            <td colSpan={2}>Долг</td>
                                        </tr>
                                        <tr className={classes.subTitle}>
                                            {_.map(listHeader, (header, index) => {
                                                if (!header.sorting) {
                                                    return <td key={index}>{header.title}</td>
                                                }
                                                return <td key={index} style={{cursor: 'pointer'}}>{header.title}</td>
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
