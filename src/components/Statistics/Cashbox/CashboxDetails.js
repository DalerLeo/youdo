import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import Loader from '../../Loader'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import Back from 'material-ui/svg-icons/content/reply'
import NotFound from '../../Images/not-found.png'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import TransactionsList from '../Finance/TransactionsList'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import {
    DateToDateField,
    TransactionTypeSearchField,
    ExpensiveCategorySearchField,
    ClientSearchField
} from '../../ReduxForm'

export const STAT_CASHBOX_DETAIL_FILTER_KEY = {
    DIVISION: 'division',
    SEARCH: 'search',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate',
    TYPE: 'type',
    CATEGORY_EXPENSE: 'categoryExpense',
    CLIENT: 'client'

}
const enhance = compose(
    injectSheet({
        green: {
            color: '#81c784'
        },
        red: {
            color: '#e57373'
        },
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        graphLoader: {
            extend: 'loader',
            height: '160px',
            marginTop: '20px'
        },
        detailWrapper: {
            background: '#fff',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '20'
        },
        wrapper: {
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px 30px',
            '& .row': {
                margin: '0'
            }
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '40px',
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
        button: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        closeDetail: {
            extend: 'button',
            background: '#12aaeb',
            marginRight: '10px'
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
        balances: {
            padding: '20px 0',
            height: '160px',
            borderTop: '1px #efefef solid',
            marginTop: '20px'
        },
        sumItem: {
            '& > div:first-child': {
                marginBottom: '15px'
            },
            '& > div': {
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '18px',
                    fontWeight: '600'
                }
            }
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        navigation: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px #efefef solid'
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
        },
        salesSummary: {
            width: '440px',
            display: 'flex'
        }
    })
)

const StatCashboxDetails = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        initialValues
    } = props
    const ZERO = 0
    const graphLoading = _.get(detailData, 'itemGraphLoading') || _.get(detailData, 'sumItemDataLoading')
    const graphAmount = _.map(_.get(detailData, ['itemGraph']), (item) => {
        return _.toNumber(_.get(item, 'balance'))
    })
    const date = _.map(_.get(detailData, ['itemGraph']), (item) => {
        return _.get(item, 'date')
    })
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const handleCloseDetail = _.get(detailData, 'handleCloseDetail')
    const startBalance = _.toNumber(_.get(detailData, ['sumItemData', 'startBalance']))
    const endBalance = _.toNumber(_.get(detailData, ['sumItemData', 'endBalance']))
    const income = _.toNumber(_.get(detailData, ['sumItemData', 'income']))
    const expenses = _.toNumber(_.get(detailData, ['sumItemData', 'expenses']))
    const intStartBalance = '(' + numberFormat(_.toNumber(_.get(detailData, ['sumItemData', 'internalStartBalance'])), primaryCurrency) + ')'
    const intEndBalance = '(' + numberFormat(_.toNumber(_.get(detailData, ['sumItemData', 'internalEndBalance'])), primaryCurrency) + ')'
    const intIncome = '(' + numberFormat(_.toNumber(_.get(detailData, ['sumItemData', 'internalIncome'])), primaryCurrency) + ')'
    const intExpenses = '(' + numberFormat(_.toNumber(_.get(detailData, ['sumItemData', 'internalExpenses'])), primaryCurrency) + ')'
    const currency = _.get(detailData, ['data', 'currency', 'name'])

    const listData = {
        listLoading: _.get(detailData, 'transactionsLoading') || _.get(detailData, 'detailLoading'),
        data: _.get(detailData, 'transactionData')
    }

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
                name="categoryExpense"
                component={ExpensiveCategorySearchField}
                label="Категории расходов"
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="type"
                component={TransactionTypeSearchField}
                label="Тип"
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="client"
                component={ClientSearchField}
                label="Клиент"
                fullWidth={true}/>
        </div>
    )

    const extraButton = (
        <a className={classes.closeDetail}
           onClick={handleCloseDetail}>
            <Back color="#fff"/> <span>Вернуться</span>
        </a>
    )

    return (
        <div className={classes.detailWrapper}>
                <div className={classes.wrapper}>
                    <StatisticsFilterExcel
                        filter={filter}
                        fields={fields}
                        filterKeys={STAT_CASHBOX_DETAIL_FILTER_KEY}
                        initialValues={initialValues}
                        handleSubmitFilterDialog={handleSubmitFilterDialog}
                        handleGetDocument={getDocument.handleDetailGetDocument}
                        extraButton={extraButton}
                    />
                    {graphLoading
                    ? <div className={classes.graphLoader}>
                        <Loader size={0.75}/>
                    </div>
                    : <div className={classes.balances}>
                        <Row className={classes.diagram}>
                            <div className={classes.salesSummary}>
                                <div style={{marginRight: '40px'}} className={classes.sumItem}>
                                    <div className={classes.balanceItem}>
                                        <span>Баланс на начало периода</span>
                                        <div className={(startBalance > ZERO) ? classes.green : (startBalance < ZERO) ? classes.red : ''}>
                                            {numberFormat(startBalance, currency)} <span>{primaryCurrency !== currency && intStartBalance}</span>
                                        </div>
                                    </div>
                                    <div className={classes.balanceItem}>
                                        <span>Баланс на конец периода</span>
                                        <div className={(endBalance > ZERO) ? classes.green : (endBalance < ZERO) ? classes.red : ''}>
                                            {numberFormat(endBalance, currency)} <span>{primaryCurrency !== currency && intEndBalance}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.sumItem}>
                                    <div className={classes.balanceItem}>
                                        <span>Приход за период</span>
                                        <div className={(income > ZERO) ? classes.green : (income < ZERO) ? classes.red : ''}>
                                            {numberFormat(income, currency)} <span>{primaryCurrency !== currency && intIncome}</span>
                                        </div>
                                    </div>
                                    <div className={classes.balanceItem}>
                                        <span>Расход за период</span>
                                        <div className={(expenses > ZERO) ? classes.red : ''}>
                                            {numberFormat(expenses, currency)} <span>{primaryCurrency !== currency && intExpenses}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{width: 'calc(100% - 440px)'}}>
                                <StatisticsChart
                                    primaryText="Баланс"
                                    primaryValues={graphAmount}
                                    tooltipTitle={date}
                                    height={120}
                                />
                            </div>
                        </Row>
                    </div>}
                    <div className={classes.listWrapper}>
                        <TransactionsList
                            isCashbox={true}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            listData={listData}
                            filter={filter}/>
                    </div>
                </div>

        </div>
    )
})

StatCashboxDetails.propTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleSubmitFilterDialog: PropTypes.func,
    getDocument: PropTypes.object
}

export default StatCashboxDetails
