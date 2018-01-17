import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import Loader from '../../Loader'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import CashboxDetails from './CashboxDetails'
import getConfig from '../../../helpers/getConfig'
import {StatisticsFilterExcel} from '../../Statistics'
import CreditCard from 'material-ui/svg-icons/action/credit-card'
import Cash from 'material-ui/svg-icons/maps/local-atm'
import t from '../../../helpers/translate'

const NEGATIVE = -1
export const STAT_CASHBOX_FILTER_KEY = {
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
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
            height: '100%',
            padding: '20px 30px',
            overflowY: 'auto',
            '& .row': {
                margin: '0 !important'
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
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
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
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '17px',
                    fontWeight: '600'
                },
                '&:last-child': {
                    textAlign: 'right'
                }
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
        },
        tableRow: {
            '& td': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(even)': {
                backgroundColor: '#f9f9f9'
            }
        },
        tableWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        cashbox: {
            cursor: 'pointer',
            borderRadius: '2px',
            border: '1px #efefef solid',
            background: '#fff',
            padding: '10px 15px',
            width: 'calc(50% - 10px)',
            marginBottom: '20px',
            transition: 'all 100ms ease-out !important',
            '& header': {
                display: 'flex',
                justifyContent: 'space-between'
            },
            '& section': {
                marginTop: '15px',
                '& > div': {
                    display: 'flex',
                    marginTop: '10px',
                    justifyContent: 'space-between'
                }
            },
            '&:hover': {
                border: '1px transparent solid',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
            }
        },
        info: {
            textAlign: 'right',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                '& span': {
                    fontWeight: '600'
                },
                '& svg': {
                    marginRight: '3px',
                    color: 'inherit !important'
                }
            }
        },
        cashboxBalance: {
            '& span': {
                display: 'block',
                '&:last-child': {
                    fontSize: '14px',
                    fontWeight: '600'
                }
            },
            '&:nth-child(even)': {
                textAlign: 'right'
            }
        }
    })
)

const StatCashboxGridList = enhance((props) => {
    const {
        filter,
        filterDetail,
        listData,
        detailData,
        classes,
        getDocument,
        detailFilterForm,
        handleSubmitFilterDialog,
        initialValues
    } = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const openDetails = _.get(listData, 'openDetails')
    const startBalance = _.get(listData, ['sumData', 'startBalance'])
    const endBalance = _.get(listData, ['sumData', 'endBalance'])
    const income = _.get(listData, ['sumData', 'income'])
    const expense = _.toNumber(_.get(listData, ['sumData', 'expenses'])) * NEGATIVE

    const iconStyle = {
        width: 20,
        height: 20
    }

    const cashboxes = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const cashier = !_.isNil(_.get(item, 'cashier')) ? _.get(item, ['cashier', 'firstName']) + ' ' + _.get(item, ['cashier', 'secondName']) : t('Неизвестно')
        const type = _.get(item, 'type')
        const typeIcon = _.get(item, 'type') === 'bank' ? (<CreditCard style={iconStyle}/>) : (<Cash style={iconStyle}/>)
        const currency = _.get(item, ['currency', 'name'])

        const cbStartBalance = numberFormat(_.get(item, 'startBalance'), primaryCurrency)
        const cbEndBalance = numberFormat(_.get(item, 'endBalance'), primaryCurrency)
        const cbIncome = numberFormat(_.get(item, 'income'), primaryCurrency)
        const cbExpenses = numberFormat(_.get(item, 'expenses'), primaryCurrency)

        return (
            <div key={id} className={classes.cashbox} onClick={() => listData.handleOpenDetail(id)}>
                <header>
                    <div>
                        <h4>{name}</h4>
                        <div>{cashier}</div>
                    </div>
                    <div className={classes.info}>
                        <div style={type === 'bank' ? {color: '#6261b0'} : {color: '#12aaeb'}}>{typeIcon} <span>{currency}</span></div>
                    </div>
                </header>
                <section>
                    <div>
                        <div className={classes.cashboxBalance}>
                            <span>{t('Баланс на начало периода')}</span>
                            <span>{cbStartBalance}</span>
                        </div>
                        <div className={classes.cashboxBalance}>
                            <span>{t('Баланс на конец периода')}</span>
                            <span>{cbEndBalance}</span>
                        </div>
                    </div>
                    <div>
                        <div className={classes.cashboxBalance}>
                            <span>{t('Приход за период')}</span>
                            <span>{cbIncome}</span>
                        </div>
                        <div className={classes.cashboxBalance}>
                            <span>{t('Расход за период')}</span>
                            <span>{cbExpenses}</span>
                        </div>
                    </div>
                </section>
            </div>
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
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_CASHBOX_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_CASHBOX_FILTER_KEY}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                            initialValues={initialValues}
                        />
                        {listLoading
                            ? <div className={classes.loader}>
                                <Loader size={0.75}/>
                            </div>
                            : _.isEmpty(cashboxes)
                                ? <div className={classes.emptyQuery}>
                                    <div>{t('По вашему запросу ничего не найдено')}</div>
                                </div>
                                : <div>
                                    <Row className={classes.balances}>
                                        <div className={classes.balanceItem}>
                                            <span>{t('Баланс на начало периода')}</span>
                                            <div>{numberFormat(startBalance, primaryCurrency)}</div>
                                        </div>
                                        <div className={classes.balanceItem}>
                                            <span>{t('Расход за период')}</span>
                                            <div>{numberFormat(expense, primaryCurrency)}</div>
                                        </div>
                                        <div className={classes.balanceItem}>
                                            <span>{t('Приход за период')}</span>
                                            <div>{numberFormat(income, primaryCurrency)}</div>
                                        </div>
                                        <div className={classes.balanceItem}>
                                            <span>{t('Баланс на конец периода')}</span>
                                            <div>{numberFormat(endBalance, primaryCurrency)}</div>
                                        </div>
                                    </Row>
                                    <div className={classes.tableWrapper}>
                                        {cashboxes}
                                    </div>
                                </div>}
                    </div>

                    {openDetails && <CashboxDetails
                        filter={filterDetail}
                        initialValues={detailFilterForm.initialValues}
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
