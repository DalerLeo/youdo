import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import _ from 'lodash'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {
    DateToDateField,
    TransactionTypeMultiSearchField,
    ExpensiveCategoryMultiSearchField,
    TransactionIncomeCategoryMultiSearch,
    ClientMultiSearchField
} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import Loader from '../../Loader'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import TransactionsList from './TransactionsList'
import t from '../../../helpers/translate'

export const STAT_FINANCE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    SEARCH: 'search',
    TYPE: 'type',
    CATEGORY_EXPENSE: 'categoryExpense',
    CATEGORY_INCOME: 'categoryIncome',
    CLIENT: 'client',
    DIVISION: 'division'
}

const NEGATIVE = -1

const enhance = compose(
    injectSheet({
        green: {
            color: '#81c784'
        },
        red: {
            color: '#e57373'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: '100%',
            overflowY: 'auto',
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
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
        graphLoader: {
            extend: 'loader',
            padding: '0',
            height: '160px',
            marginTop: '20px'
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
        diagram: {
            marginTop: '20px',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '& > div:last-child': {
                paddingRight: '0'
            }
        },
        summaryTitle: {
            color: '#666'
        },
        summaryValue: {
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '10px',
            '&:last-child': {
                margin: '0'
            }
        },
        mainSummary: {
            '& > div:last-child': {
                borderBottom: '1px #efefef solid',
                fontSize: '20px',
                paddingBottom: '10px'
            }
        },
        secondarySummary: {
            margin: '10px 0',
            '& span': {
                display: 'block'
            },
            '& > div': {
                fontSize: '16px'
            }
        },
        chart: {
            '& .highcharts-label': {
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px !important'
            }
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)
const StatFinanceGridList = enhance((props) => {
    const {
        graphData,
        classes,
        filter,
        handleSubmitFilterDialog,
        listData,
        initialValues,
        getDocument
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const sumIn = _.sumBy(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const valueIn = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.toNumber(_.get(item, 'amount'))
    })
    const sumOut = _.sumBy(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueOut = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.toNumber(_.get(item, 'amount')) * NEGATIVE
    })
    const valueInName = _.map(_.get(graphData, 'dataIn'), (item) => {
        return _.get(item, 'date')
    })
    const valueOutName = _.map(_.get(graphData, 'dataOut'), (item) => {
        return _.get(item, 'date')
    })
    const tooltipDate = valueInName.length < valueOutName.length ? valueOutName : valueInName
    const graphLoading = _.get(graphData, 'graphInLoading') || _.get(graphData, 'graphOutLoading')
    const profit = sumIn - sumOut

    const fields = (
        <div>
            <Field className={classes.inputFieldCustom} name="date" component={DateToDateField} label={t('Диапазон дат')} fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="categoryExpense" component={ExpensiveCategoryMultiSearchField} label={t('Категории расходов')} fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="categoryIncome" component={TransactionIncomeCategoryMultiSearch} label={t('Категории доходов')} fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="type" component={TransactionTypeMultiSearchField} label={t('Тип')} fullWidth={true}/>
            <Field className={classes.inputFieldCustom} name="client" component={ClientMultiSearchField} label={t('Клиент')} fullWidth={true}/>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_FINANCE_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={STAT_FINANCE_FILTER_KEY}
                            fields={fields}
                            handleGetDocument={getDocument.handleGetDocument}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            initialValues={initialValues}
                        />
                        {graphLoading
                            ? <div className={classes.graphLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <Row className={classes.diagram}>
                                <Col xs={3} className={classes.salesSummary}>
                                    <div className={classes.mainSummary}>
                                        <span className={classes.summaryTitle}>{t('Разница')}</span>
                                        <div className={classes.summaryValue}>{numberFormat(profit)} {primaryCurrency}</div>
                                    </div>
                                    <div className={classes.secondarySummary}>
                                        <span className={classes.summaryTitle}>{t('Приход за период')}</span>
                                        <div className={classes.summaryValue}>{numberFormat(sumIn)} {primaryCurrency}</div>
                                        <span className={classes.summaryTitle}>{t('Расход за период')}</span>
                                        <div className={classes.summaryValue}>{numberFormat(sumOut)} {primaryCurrency}</div>
                                    </div>
                                </Col>
                                <Col xs={9} className={classes.chart}>
                                    <StatisticsChart
                                        primaryText={t('Доход')}
                                        secondaryText={t('Расход')}
                                        primaryValues={valueIn}
                                        secondaryValues={valueOut}
                                        tooltipTitle={tooltipDate}
                                        height={160}
                                    />
                                </Col>
                            </Row>}
                        <TransactionsList
                            filter={filter}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            listData={listData}
                        />
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

StatFinanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatFinanceGridList
