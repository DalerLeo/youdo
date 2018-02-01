import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field} from 'redux-form'
import Loader from '../Loader'
import StatSideMenu from './StatSideMenu'
import {DateToDateField, DivisionMultiSearchField} from '../ReduxForm'
import Container from '../Container'
import * as ROUTES from '../../constants/routes'
import numberFormat from '../../helpers/numberFormat'
import moduleFormat from '../../helpers/moduleFormat'
import getConfig from '../../helpers/getConfig'
import {StatisticsFilterExcel} from '../Statistics'
import t from '../../helpers/translate'

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
    const measurement = 'шт'
    const stockData = _.get(listData, ['data', 'stock'])
    const cashBoxesData = _.get(listData, ['data', 'cashboxes'])
    const clientsDebtData = _.get(listData, ['data', 'debtors', 'clientsDebt'])
    const providersDebtData = _.get(listData, ['data', 'debtors', 'providersDebt'])
    const salesData = _.get(listData, ['data', 'sales'])
    const transferData = _.get(listData, ['data', 'transfer'])
    const stock = (
        <div className={classes.block}>
            <span>{t('Склад')}</span>
            <ul>
                <li>
                    <span>{t('Сумма товаров на начало периода')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'beginBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'beginPriceSum'), currency)}</div>
                    </div>
                </li>
                <li>
                    <span>{t('Поступления на склад')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'inBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'inPriceSum'), currency)}</div>
                    </div>
                </li>
                <li>
                    <span>{t('Возврат за период')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'returnBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'returnPriceSum'), currency)}</div>
                    </div>
                </li>
                <li>
                    <span>{t('Выдано по заказам')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'outBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'outPriceSum'), currency)}</div>
                    </div>
                </li>
                <li>
                    <span>{t('Списано со склада')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'writeoffBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'writeoffPriceSum'), currency)}</div>
                    </div>
                </li>
                <li>
                    <span>{t('Сумма товаров на конец периода')}</span>
                    <div>
                        <div>{moduleFormat(_.get(stockData, 'endBalanceSum'), measurement)}</div>
                        <div>{moduleFormat(_.get(stockData, 'endPriceSum'), currency)}</div>
                    </div>
                </li>
            </ul>
        </div>
    )

    const productRealisation = (
        <div className={classes.block}>
            <span>{t('Реализация товара')}</span>
            <ul>
                <li>
                    <span>{t('Стоимость проданного товара')}</span>
                    <span>{numberFormat(_.get(salesData, 'salesSum'), currency)}</span>
                </li>
                <li>
                    <span>{t('Сумма возвратов')}</span>
                    <span>{numberFormat(_.get(salesData, 'returnSum'), currency)}</span>
                </li>
                <li>
                    <span>{t('Фактическая сумма продаж')}</span>
                    <span>{numberFormat(_.get(salesData, 'factSum'), currency)}</span>
                </li>
                <li>
                    <span>{t('Себестоимость товара')}</span>
                    <span>{numberFormat(_.get(salesData, 'netCost'), currency)}</span>
                </li>
                <li>
                    <span dangerouslySetInnerHTML={{__html: t('Сумма товаров, проданных<br/> дешевле себестоимости')}}/>
                    <span>{numberFormat(_.get(salesData, 'lessNetCostSum'), currency)}</span>
                </li>
                <li>
                    <span>{t('Прибыль от продаж')}</span>
                    <span>{numberFormat(_.get(salesData, 'salesProfit'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const incomeOutcome = (
        <div className={classes.block}>
            <span>{t('Доходы / Расходы')}</span>
            <ul>
                <li>
                    <span>{t('Прибыль от продаж')}</span>
                    <span>{numberFormat(_.get(transferData, 'salesProfit'), currency)}</span>
                </li>
                <li>
                    <span>{t('Списанные товары')}</span>
                    <span>{numberFormat(_.get(transferData, 'writeoff'), currency)}</span>
                </li>
                <li>
                    <span>{t('Прочие расходы фирмы')}</span>
                    <span>{numberFormat(_.get(transferData, 'expanses'), currency)}</span>
                </li>
                <li>
                    <span>{t('Прибыль фирмы')}</span>
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

    const clientDebtors = (
        <div className={classes.block}>
            <span>Задолжности (клиенты)</span>
            <ul>
                <li>
                    <span>Задолжники нал. ({_.get(clientsDebtData, 'borrowersCountCash')})</span>
                    <span>{moduleFormat(_.get(clientsDebtData, 'borrowersSumCash'), currency)}</span>
                </li>
                <li>
                    <span>Задолжники переч. ({_.get(clientsDebtData, 'borrowersCountBank')})</span>
                    <span>{moduleFormat(_.get(clientsDebtData, 'borrowersSumBank'), currency)}</span>
                </li>
                <li>
                    <span>Закладчики нал. ({_.get(clientsDebtData, 'loanersCountCash')})</span>
                    <span>{moduleFormat(_.get(clientsDebtData, 'loanersSumCash'), currency)}</span>
                </li>
                <li>
                    <span>Закладчики переч. ({_.get(clientsDebtData, 'loanersCountBank')})</span>
                    <span>{moduleFormat(_.get(clientsDebtData, 'loanersSumBank'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const providerDebtors = (
        <div className={classes.block}>
            <span>Задолжности (поставщики)</span>
            <ul>
                <li>
                    <span>Задолжники нал. ({_.get(providersDebtData, 'borrowersCountCash')})</span>
                    <span>{moduleFormat(_.get(providersDebtData, 'borrowersSumCash'), currency)}</span>
                </li>
                <li>
                    <span>Задолжники переч. ({_.get(providersDebtData, 'borrowersCountBank')})</span>
                    <span>{moduleFormat(_.get(providersDebtData, 'borrowersSumBank'), currency)}</span>
                </li>
                <li>
                    <span>Закладчики нал. ({_.get(providersDebtData, 'loanersCountCash')})</span>
                    <span>{moduleFormat(_.get(providersDebtData, 'loanersSumCash'), currency)}</span>
                </li>
                <li>
                    <span>Закладчики переч. ({_.get(providersDebtData, 'loanersCountBank')})</span>
                    <span>{moduleFormat(_.get(providersDebtData, 'loanersSumBank'), currency)}</span>
                </li>
            </ul>
        </div>
    )

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label="Диапазон дат"
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="division"
                component={DivisionMultiSearchField}
                label={t('Организация')}
                fullWidth={true}/>
        </div>
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
                                <Loader size={0.75}/>
                            </div>
                            : <div className={classes.blocksWrapper}>
                                <div>
                                    {stock}
                                    {productRealisation}
                                    {incomeOutcome}
                                </div>
                                <div>
                                    {cashboxReports}
                                    {clientDebtors}
                                    {providerDebtors}
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
