import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import CircularProgress from 'material-ui/CircularProgress'
import StatSideMenu from './StatSideMenu'
import {DateToDateField} from '../ReduxForm'
import Container from '../Container'
import * as ROUTES from '../../constants/routes'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import {StatisticsFilterExcel} from '../Statistics'

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        wrapper: {
            padding: '20px 30px',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        blocksWrapper: {
            display: 'flex',
            padding: '15px 0',
            '& > div': {
                width: '50%',
                '&:first-child': {
                    paddingRight: '15px'
                },
                '&:last-child': {
                    paddingLeft: '15px'
                }
            }
        },
        block: {
            marginBottom: '15px',
            '& > span': {
                fontWeight: 'bold'
            },
            '& ul': {
                border: '1px #efefef solid',
                marginTop: '15px',
                '& li': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px',
                    lineHeight: '15px',
                    '&:nth-child(even)': {
                        background: '#f9f9f9'
                    },
                    '& > div': {
                        textAlign: 'right',
                        '& span': {
                            display: 'block',
                            position: 'relative',
                            '&:before': {
                                content: '"нал."',
                                position: 'absolute',
                                left: '-60px',
                                width: '50px'
                            },
                            '&:last-child:before': {
                                content: '"безнал."'
                            }
                        }
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
        }
    }),
    reduxForm({
        form: 'StatReportFilterForm',
        enableReinitialize: true
    })
)

export const STAT_REPORT_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DIVISION: 'division'

}

const StatReportGridList = enhance((props) => {
    const {
        filter,
        classes,
        listData,
        getDocument,
        onSubmit,
        initialValues
    } = props
    const listLoading = _.get(listData, 'listLoading')

    const currency = getConfig('PRIMARY_CURRENCY')
    const stockData = _.get(listData, ['data', 'stock'])
    const cashBoxesData = _.get(listData, ['data', 'cashboxes'])
    const debtorsData = _.get(listData, ['data', 'debtors'])
    const salesData = _.get(listData, ['data', 'sales'])
    const transferData = _.get(listData, ['data', 'transfer'])
    const stock = (
        <div className={classes.block}>
            <span>Склад</span>
            <ul>
                <li>
                    <span>Сумма товаров на начало периода</span>
                    <span>{numberFormat(_.get(stockData, 'beginPriceSum'), currency)}</span>
                </li>
                <li>
                    <span>Поступления на склад</span>
                    <span>{numberFormat(_.get(stockData, 'inPriceSum'), currency)}</span>
                </li>
                <li>
                    <span>Выдано со склада</span>
                    <span>{numberFormat(_.get(stockData, 'outPriceSum'), currency)}</span>
                </li>
                <li>
                    <span>Сумма товаров на конец периода</span>
                    <span>{numberFormat(_.get(stockData, 'endPriceSum'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const productRealisation = (
        <div className={classes.block}>
            <span>Реализация товара</span>
            <ul>
                <li>
                    <span>Стоимость проданного товара</span>
                    <span>{numberFormat(_.get(salesData, 'salesSum'), currency)}</span>
                </li>
                <li>
                    <span>Себистоимость товара</span>
                    <span>{numberFormat(_.get(salesData, 'netCost'), currency)}</span>
                </li>
                <li>
                    <span>Доход от продаж</span>
                    <span>{numberFormat(_.get(salesData, 'salesProfit'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const incomeOutcome = (
        <div className={classes.block}>
            <span>Доходы / Расходы</span>
            <ul>
                <li>
                    <span>Доход от продаж</span>
                    <span>{numberFormat(_.get(transferData, 'salesSum'), currency)}</span>
                </li>
                <li>
                    <span>Списанные товары</span>
                    <span>{numberFormat(_.get(transferData, 'writeoff'), currency)}</span>
                </li>
                <li>
                    <span>Прочие расходы фирмы</span>
                    <span>{numberFormat(_.get(transferData, 'expenses'), currency)}</span>
                </li>
                <li>
                    <span>Прибыль фирмы</span>
                    <span>{numberFormat(_.get(transferData, 'profit'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const cashboxReports = (
        <div className={classes.block}>
            <span>Отчет по кассам</span>
            <ul>
                <li>
                    <span>Баланс <br/> на начало периода</span>
                    <div>
                        <span>{numberFormat(_.get(cashBoxesData, ['startBalance', 'cash']), currency)}</span>
                        <span>{numberFormat(_.get(cashBoxesData, ['startBalance', 'bank']), currency)}</span>
                    </div>
                </li>
                <li>
                    <span>Поступления</span>
                    <div>
                        <span>{numberFormat(_.get(cashBoxesData, ['income', 'cash']), currency)}</span>
                        <span>{numberFormat(_.get(cashBoxesData, ['income', 'bank']), currency)}</span>
                    </div>
                </li>
                <li>
                    <span>Списания</span>
                    <div>
                        <span>{numberFormat(_.get(cashBoxesData, ['expenses', 'cash']), currency)}</span>
                        <span>{numberFormat(_.get(cashBoxesData, ['expenses', 'bank']), currency)}</span>
                    </div>
                </li>
                <li>
                    <span>Баланс <br/> на конец периода</span>
                    <div>
                        <span>{numberFormat(_.get(cashBoxesData, ['endBalance', 'cash']), currency)}</span>
                        <span>{numberFormat(_.get(cashBoxesData, ['endBalance', 'bank']), currency)}</span>
                    </div>
                </li>
            </ul>
        </div>
    )

    const debtors = (
        <div className={classes.block}>
            <span>Задолжности</span>
            <ul>
                <li>
                    <span>Задолжности клиентов</span>
                    <span>{numberFormat(_.get(debtorsData, 'debtsSum'), currency)}</span>
                </li>
                <li>
                    <span>Задолжности фирмы</span>
                    <span>{numberFormat(_.get(debtorsData, 'expectSum'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const fields = (
        <Field
            className={classes.inputFieldCustom}
            name="date"
            component={DateToDateField}
            label="Диапазон дат"
            fullWidth={true}/>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_REPORT_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={STAT_REPORT_FILTER_KEY}
                            fields={fields}
                            handleSubmitFilterDialog={onSubmit}
                            handleGetDocument={getDocument.handleGetDocument}
                            initialValues={initialValues}
                        />
                        {listLoading
                            ? <div className={classes.loader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                            : <div className={classes.blocksWrapper}>
                                <div>
                                    {stock}
                                    {productRealisation}
                                    {incomeOutcome}
                                </div>
                                <div>
                                    {cashboxReports}
                                    {debtors}
                                </div>
                            </div>}
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

StatReportGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatReportGridList
