import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import {compose, withState, lifecycle} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {
    TextField,
    ZoneMultiSearchField,
    DivisionMultiSearchField,
    DateToDateField,
    ProviderBalanceTypeSearchField,
    PaymentTypeSearchField
} from '../../ReduxForm'
import ProviderInfoDialog from './ProviderInfoDialog'
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
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen'
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit'
import t from '../../../helpers/translate'
import {CLIENT_BALANCE_FILTER_KEY} from '../../ClientBalance'
import {hashHistory} from 'react-router'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import Paper from 'material-ui/Paper'
import ordering from '../../../helpers/ordering'
import SubMenu from '../../SubMenu/SubMenu'
import ProviderBalanceFilterForm from './ProviderBalanceFilterForm'
import FlatButton from 'material-ui/FlatButton'

let amountValues = []
let head = []

export const STAT_PROVIDER_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    ZONE: 'zone',
    DIVISION: 'division',
    SEARCH: 'search',
    PAYMENT_TYPE: 'paymentType',
    BALANCE_TYPE: 'balanceType'
}

const types = {
    cash: 'cash',
    bank: 'bank',
    debtor: 'debtor',
    loaner: 'loaner'
}

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 0',
            background: '#fff',
            zIndex: '30'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            padding: '20px 30px',
            height: '100%',
            '& .row': {
                margin: '0 !important'
            }
        },
        container: {
            position: 'relative'
        },
        tableWrapper: {
            display: 'flex',
            margin: ({stat}) => stat ? '0 -30px' : 'unset',
            'margin-right': ({stat}) => stat ? '' : '-30px',
            paddingLeft: '30px',
            position: 'relative',
            overflow: 'hidden',
            'min-height': ({stat}) => stat ? '200px' : 'unset',
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
        tableWrapperLoading: {
            display: 'block',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
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
                    height: '41px',
                    verticalAlign: 'bottom',
                    '& span': {
                        fontWeight: '600',
                        verticalAlign: 'middle',
                        padding: '0 30px',
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
        mainTable: {
            width: '100%',
            minWidth: '850px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '200px'
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
            '& td:last-child': {
                textAlign: 'right'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            }
        },
        tableRow: {
            cursor: 'pointer',
            '& td': {
                borderLeft: '1px #efefef solid'
            },
            '& td:nth-child(odd)': {
                textAlign: 'left',
                '&:first-child': {
                    borderLeft: 'none'
                }
            },
            '& td:nth-child(even)': {
                borderRight: '1px #efefef solid',
                '&:first-child': {
                    borderRight: 'none'
                }
            },
            '&:nth-child(even)': {
                backgroundColor: '#f9f9f9'
            },
            '& td:last-child': {
                borderRight: '1px #efefef solid'
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
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                '&:last-child': {
                    margin: '0'
                },
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
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        dateFilter: {
            display: 'flex',
            alignItems: 'center',
            '& span': {
                fontWeight: '600'
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
            overflowY: 'auto'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
        emptyQuery: {
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '200px',
            padding: '160px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            zIndex: '30',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },
        pointer: {
            cursor: 'pointer'
        },
        header: {
            position: 'relative',
            top: 'auto'
        },
        alignRightFlex: {
            justifyContent: 'flex-end'
        },
        filters: {
            display: 'flex',
            position: 'relative',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            padding: ({stat}) => stat ? '' : '0 30px'
        },
        opacity: {
            '& span': {
                color: '#777',
                margin: '0 2px'
            }
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
        fullScreen: {
            marginLeft: '10px !important'
        },
        summary: {
            padding: ({stat}) => stat ? '20px 0' : '0'
        },
        summaryWrapper: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& > button': {
                height: 'auto !important',
                lineHeight: 'inherit !important',
                textAlign: 'left !important',
                width: 'calc((100% / 4) - 15px)',
                '&:last-child': {
                    textAlign: 'right !important'
                }
            }
        },
        summaryItem: {
            padding: '10px 20px',
            '& > div': {
                fontSize: '17px',
                fontWeight: '600'
            }
        },
        summaryLoader: {
            width: '100%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            padding: '0'
        },
        red: {
            color: '#e27676',
            fontWeight: '600'
        },
        green: {
            fontWeight: '600',
            color: '#92ce95'
        },
        icon: {
            color: '#666 !important',
            height: '15px !important'
        }

    }),
    withState('currentRow', 'updateRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    withState('currentItem', 'setItem', null),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const showPaymentType = _.get(state, ['form', 'StatisticsFilterForm', 'values', 'balanceType', 'value'])
        return {
            showPaymentType
        }
    }),
    lifecycle({
        componentDidMount () {
            const horizontalTable = this.refs.horizontalTable
            horizontalScroll(horizontalTable)
        }
    })
)

const styleOnHover = {
    background: '#efefef',
    cursor: 'pointer'
}

const iconStyle = {
    icon: {
        width: 24,
        height: 24
    },
    button: {
        width: 36,
        height: 36,
        padding: 6
    }
}

const StatProviderGridList = enhance((props) => {
    const {
        classes,
        listData,
        summaryData,
        filter,
        handleSubmitFilterDialog,
        detailData,
        infoDialog,
        getDocument,
        initialValues,
        handleSubmit,
        filterOpen,
        currentRow,
        updateRow,
        expandedTable,
        setExpandedTable,
        setItem,
        filterDialog,
        stat,
        showPaymentType
    } = props
    const ZERO = 0
    const query = filter.getParams()
    const listLoading = _.get(listData, 'listLoading')
    const divisionStatus = getConfig('DIVISIONS')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const emptyData = _.isEmpty(_.get(listData, 'data'))

    // Summary
    const borrowersBank = Math.abs(_.get(summaryData, ['data', 'borrowersSumBank']))
    const borrowersBankCount = _.get(summaryData, ['data', 'borrowersCountBank'])
    const borrowersCash = Math.abs(_.get(summaryData, ['data', 'borrowersSumCash']))
    const borrowersCashCount = _.get(summaryData, ['data', 'borrowersCountCash'])
    const loanersBank = Math.abs(_.get(summaryData, ['data', 'loanersSumBank']))
    const loanersBankCount = _.get(summaryData, ['data', 'loanersCountBank'])
    const loanersCash = Math.abs(_.get(summaryData, ['data', 'loanersSumCash']))
    const loanersCashCount = _.get(summaryData, ['data', 'loanersCountCash'])
    const sumLoading = _.get(summaryData, ['sumLoading'])

    const orderNoSorting = _.isNil(filter.getSortingType('orders'))
        ? null
        : filter.getSortingType('orders')
            ? <ArrowUpIcon className={classes.icon}/>
            : <ArrowDownIcon className={classes.icon}/>
    const totalSorting = _.isNil(filter.getSortingType('total'))
        ? null
        : filter.getSortingType('total')
            ? <ArrowUpIcon className={classes.icon}/>
            : <ArrowDownIcon className={classes.icon}/>
    const providers = (
        <div className={classes.leftTable}>
            <div><span>{t('Поставщик')}</span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name')
                return (
                    <div
                        key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => updateRow(id)}
                        onMouseLeave={() => updateRow(null)}>
                        <span>{name}</span>
                    </div>
                )
            })}
        </div>
    )

    head = []
    _.map(_.get(listData, ['data', '0', 'divisions']), (item) => {
        if (item.id) {
            head.push({name: item.name + t(' нал.'), id: item.id, type: t('cash')})
            head.push({name: item.name + t(' переч.'), id: item.id, type: t('bank')})
        } else {
            head.push({name: t('Наличный'), id: item.id, type: t('cash')})
            head.push({name: t('Перечисление'), id: item.id, type: t('bank')})
        }
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="createdDate"
                component={DateToDateField}
                label={t('Диапазон дат')}
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="balanceType"
                component={ProviderBalanceTypeSearchField}
                label={t('Тип баланса')}
                fullWidth={true}/>
            {showPaymentType && <Field
                className={classes.inputFieldCustom}
                name="paymentType"
                disable={true}
                component={PaymentTypeSearchField}
                label={t('Тип оплаты')}
                fullWidth={true}/>
            }
            <Field
                className={classes.inputFieldCustom}
                name="zone"
                component={ZoneMultiSearchField}
                label={t('Зона')}
                fullWidth={true}/>
            {divisionStatus && <Field
                className={classes.inputFieldCustom}
                name="division"
                component={DivisionMultiSearchField}
                label={t('Организация')}
                fullWidth={true}/>}
        </div>
    )

    const queryOrdering = _.get(query, 'ordering')
    const orderingFunction = (name) => {
        ordering(filter, name, props.pathname)
        if (queryOrdering === name) {
            ordering(filter, '-' + name, props.pathname)
        } else if (queryOrdering === '-' + name) {
            ordering(filter, '', props.pathname)
        } else {
            ordering(filter, name, props.pathname)
        }
    }

    const headerButtons = [
        {
            balanceType: types.debtor,
            paymentType: types.cash,
            content: (
                <div className={classes.summaryItem}>
                    {t('Долг поставщику нал')}. ({borrowersCashCount})
                    <div>{numberFormat(borrowersCash, primaryCurrency)}</div>
                </div>
            )
        },
        {
            balanceType: types.debtor,
            paymentType: types.bank,
            content: (
                <div className={classes.summaryItem}>
                    {t('Долг поставщику переч')}. ({borrowersBankCount})
                    <div>{numberFormat(borrowersBank, primaryCurrency)}</div>
                </div>
            )
        },
        {
            balanceType: types.loaner,
            paymentType: types.cash,
            content: (
                <div className={classes.summaryItem}>
                    {t('Долг поставщика нал')}. ({loanersCashCount})
                    <div>{numberFormat(loanersCash, primaryCurrency)}</div>
                </div>
            )
        },
        {
            balanceType: types.loaner,
            paymentType: types.bank,
            content: (
                <div className={classes.summaryItem}>
                    {t('Долг поставщика переч')}. ({loanersBankCount})
                    <div>{numberFormat(loanersBank, primaryCurrency)}</div>
                </div>
            )
        }
    ]

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => { orderingFunction('supplies') }}>
                    {t('Кол-во поставок')} {orderNoSorting}
                </td>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => { orderingFunction('total') }}>
                    {t('Сумма')} {totalSorting}
                </td>
                {_.map(head, (item, index) => {
                    const sortingType = filter.getSortingType(item.type + '_' + item.id)
                    const icon = _.isNil(sortingType)
                        ? null
                        : sortingType
                            ? <ArrowUpIcon className={classes.icon}/>
                            : <ArrowDownIcon className={classes.icon}/>
                    const sortingFunc = () => {
                        switch (queryOrdering) {
                            case item.type + '_' + item.id: return ordering(filter, '-' + item.type + '_' + item.id, props.pathname)
                            case '-' + item.type + '_' + item.id: return ordering(filter, '', props.pathname)
                            default: return ordering(filter, item.type + '_' + item.id, props.pathname)
                        }
                    }
                    return (
                        <td
                            key={index}
                            style={{cursor: 'pointer'}}
                            onClick={sortingFunc}>
                            {item.name}{icon}
                        </td>
                    )
                })}
            </tr>

            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const suppliesCount = numberFormat(_.get(item, 'supplies'))
                amountValues = []
                _.map(_.get(item, 'divisions'), (child) => {
                    amountValues.push({amount: _.get(child, 'cash'), type: 'cash', id: _.get(child, 'id')})
                    amountValues.push({amount: _.get(child, 'bank'), type: 'bank', id: _.get(child, 'id')})
                })
                const totalSum = _.toNumber(_.get(item, 'total'))
                return (
                    <tr key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => updateRow(id)}
                        onMouseLeave={() => updateRow(null)}
                        onClick={() => { infoDialog.handleOpenInfoDialog(id) }}
                        className={classes.tableRow}>
                        <td>{suppliesCount}</td>
                        <td><span className={totalSum > ZERO ? classes.green : totalSum < ZERO ? classes.red : ''}>{numberFormat(totalSum, primaryCurrency)}</span></td>
                        {_.map(amountValues, (val, index) => {
                            const amount = _.toNumber(_.get(val, 'amount'))
                            return (
                                <td key={index}>
                                    <span className={(amount > ZERO) ? classes.green : (amount < ZERO) ? classes.red : ''}>
                                        {numberFormat(amount, primaryCurrency)}
                                    </span>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )

    const balanceType = filter.getParam(CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE)
    const paymentType = filter.getParam(CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE)
    const flatButtonStyle = {
        activeColor: '#71ce87',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        hoverColor: 'rgba(0, 0, 0, 0.08)',
        rippleColor: 'rgba(0, 0, 0, 0.12)'
    }
    const summary = (
        <div className={classes.summary}>
            {sumLoading
                ? <div className={classes.sumLoader}>
                    <Loader size={0.75}/>
                </div>
                : <div className={classes.summaryWrapper}>
                    {_.map(headerButtons, (item, index) => {
                        const isActive = balanceType === item.balanceType && paymentType === item.paymentType
                        return <FlatButton
                            key={index}
                            backgroundColor={isActive
                                ? flatButtonStyle.activeColor
                                : flatButtonStyle.backgroundColor}
                            hoverColor={isActive
                                ? flatButtonStyle.activeColor
                                : flatButtonStyle.hoverColor}
                            rippleColor={flatButtonStyle.rippleColor}
                            disableTouchRipple={isActive}
                            style={{color: isActive ? '#fff' : '#333'}}
                            onTouchTap={() => isActive
                                ? null
                                : hashHistory.push({
                                    pathname: props.pathname,
                                    query: filter.getParams({
                                        [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: item.paymentType,
                                        [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: item.balanceType})
                                })}
                            children={item.content}
                        />
                    })}
                </div>}
        </div>
    )
    const navigation = (
        <div className={classes.filters}>
            {!stat && <ProviderBalanceFilterForm
                initialValues={filterDialog.initialValues}
                filter={filter}
                filterDialog={filterDialog}/>}
            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                <Field
                    className={classes.inputFieldCustom}
                    name="search"
                    component={TextField}
                    hintText={t('Поиск')}/>
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
    )
    const list = (
        <div className={classes.container}>
            {listLoading && <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>}
            <div className={(listLoading || emptyData)
                    ? classes.tableWrapperLoading
                    : classes.tableWrapper}>
                {!(emptyData || listLoading) && providers}
                {emptyData && !listLoading &&
                <div className={classes.emptyQuery}>
                    <div>{t('По вашему запросу ничего не найдено')}</div>
                </div>}
                <div ref="horizontalTable">
                    {!(emptyData || listLoading) && tableList}
                </div>
            </div>
        </div>
    )

    const statPage = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PROVIDERS_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterOpen={filterOpen}
                            fields={fields}
                            filterKeys={STAT_PROVIDER_FILTER_KEY}
                            initialValues={initialValues}
                            withoutDate={true}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        {summary}
                        <div className={expandedTable ? classes.expandedTable : ''}>
                            {navigation}
                            {list}
                        </div>
                    </div>
                </div>
            </Row>
        </div>
    )

    const page = (
        <div>
            <SubMenu url={ROUTES.PROVIDER_BALANCE_LIST_URL}/>
            <div style={{marginBottom: '15px'}}>{summary}</div>
            <Paper className={expandedTable ? classes.expandedTable : ''} style={expandedTable ? {padding: '0'} : {}}>
                {navigation}
                {list}
            </Paper>
        </div>
    )

    const provider = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})

    return (
        <Container>
            {stat && statPage}
            {!stat && page}

            <ProviderInfoDialog
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filterItem={detailData.filter}
                filter={filter}
                name={_.get(provider, 'name')}
                paymentType={_.get(infoDialog, ['division', 'name']) + _.get(infoDialog, 'type')}
                balance={_.get(infoDialog, 'balance')}
                setItem={setItem}
                info={infoDialog.info}
                infoLoading={infoDialog.infoLoading}
            />
        </Container>
    )
})

StatProviderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    getDocument: PropTypes.object.isRequired
}

export default StatProviderGridList
