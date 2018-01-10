import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container'
import injectSheet from 'react-jss'
import {compose, withState, lifecycle} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField, ZoneMultiSearchField, DivisionMultiSearchField, DateToDateField} from '../../ReduxForm'
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
import ordering from '../../../helpers/ordering'

let amountValues = []
let head = []

export const STAT_PROVIDER_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    ZONE: 'zone',
    DIVISION: 'division',
    SEARCH: 'search'
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
            position: 'absolute',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0',
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
            '& td:last-child': {
                textAlign: 'right'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            }
        },
        tableRow: {
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
            '&:nth-child(odd)': {
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
            justifyContent: 'space-between',
            marginTop: '10px',
            borderTop: '1px #efefef solid'
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
            padding: '20px 0'
        },
        summaryWrapper: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                cursor: 'pointer',
                fontWeight: '400',
                '& div': {
                    fontSize: '17px',
                    marginTop: '2px',
                    fontWeight: '600'
                },
                '&:last-child': {
                    textAlign: 'right'
                }
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
        }
    }),
    withState('currentRow', 'updateRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    withState('currentItem', 'setItem', null),
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
        setItem
    } = props

    const ZERO = 0
    const query = filter.getParams()
    const listLoading = _.get(listData, 'listLoading')
    const divisionStatus = getConfig('DIVISIONS')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

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
            <div><span>Поставщик</span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name') || 'No'
                return (
                    <div
                        key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => updateRow(id)}
                        onMouseLeave={() => updateRow(null)}><span>{name}</span>
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
                name="date"
                component={DateToDateField}
                label={t('Диапазон дат')}
                fullWidth={true}/>
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

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                        ordering(filter, 'supplies', props.pathname)
                        if (_.get(query, 'ordering') === 'supplies') {
                            ordering(filter, '-supplies', props.pathname)
                        } else if (_.get(query, 'ordering') === '-supplies') {
                            ordering(filter, '', props.pathname)
                        } else {
                            ordering(filter, 'supplies', props.pathname)
                        }
                    }}>
                    {t('Кол-во поставок')} {orderNoSorting}
                </td>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                        ordering(filter, 'total', props.pathname)
                        if (_.get(query, 'ordering') === 'total') {
                            ordering(filter, '-total', props.pathname)
                        } else if (_.get(query, 'ordering') === '-total') {
                            ordering(filter, '', props.pathname)
                        } else {
                            ordering(filter, 'total', props.pathname)
                        }
                    }}>{t('Сумма')} {totalSorting}
                </td>
                {_.map(head, (item, index) => {
                    const sortingType = filter.getSortingType(item.type + '_' + item.id)
                    const icon = _.isNil(sortingType)
                        ? null
                        : sortingType
                            ? <ArrowUpIcon className={classes.icon}/>
                            : <ArrowDownIcon className={classes.icon}/>
                    const sortingFunc = () => {
                        switch (_.get(query, 'ordering')) {
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
                        className={classes.tableRow}>
                        <td>{suppliesCount}</td>
                        <td><span className={totalSum > ZERO ? classes.green : totalSum < ZERO ? classes.red : ''}>{numberFormat(totalSum, primaryCurrency)}</span></td>
                        {_.map(amountValues, (val, index) => {
                            const amount = _.toNumber(_.get(val, 'amount'))
                            return (
                                <td key={index}
                                    onClick={() => { infoDialog.handleOpenInfoDialog(id, _.get(val, 'id'), _.get(val, 'type')) }}
                                    style={id === currentRow ? {background: '#efefef', cursor: 'pointer'} : {cursor: 'pointer'}}>
                                    <span className={(amount > ZERO) ? classes.green : (amount < ZERO) ? classes.red : ''}>{numberFormat(amount, primaryCurrency)}</span>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )

    const page = (
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
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        <div className={classes.summary}>
                            {sumLoading
                                ? <div className={classes.sumLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.summaryWrapper}>
                                    <div
                                        onClick={() => hashHistory.push(
                                            filter.createURL({
                                                [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.cash,
                                                [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.debtor
                                            }))}>
                                        {t('Задолжники нал')}. - {borrowersCashCount}
                                        <div>{numberFormat(borrowersCash, primaryCurrency)}</div>
                                    </div>
                                    <div
                                        onClick={() => hashHistory.push(
                                            filter.createURL({
                                                [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.bank,
                                                [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.debtor
                                            }))}>
                                        {t('Задолжники переч')}. - {borrowersBankCount}
                                        <div>{numberFormat(borrowersBank, primaryCurrency)}</div>
                                    </div>
                                    <div
                                        onClick={() => hashHistory.push(
                                            filter.createURL({
                                                [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.cash,
                                                [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.loaner
                                            }))}>
                                        {t('Закладчики нал')}. - {loanersCashCount}
                                        <div>{numberFormat(loanersCash, primaryCurrency)}</div>
                                    </div>
                                    <div
                                        onClick={() => hashHistory.push(
                                            filter.createURL({
                                                [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.bank,
                                                [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.loaner
                                            }))}>
                                        {t('Закладчики переч')}. - {loanersBankCount}
                                        <div>{numberFormat(loanersBank, primaryCurrency)}</div>
                                    </div>
                                </div>}
                        </div>
                        <div className={expandedTable ? classes.expandedTable : ''}>
                            <div className={classes.filters}>
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
                            <div className={classes.container}>
                                {listLoading && <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>}
                                <div className={classes.tableWrapper}>
                                    {providers}
                                    {_.isEmpty(tableList) && !listLoading &&
                                    <div className={classes.emptyQuery}>
                                        <div>{t('По вашему запросу ничего не найдено')}</div>
                                    </div>}
                                    <div ref="horizontalTable">
                                        {tableList}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
        </div>
    )

    const provider = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})

    return (
        <Container>
            {page}
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
            />
        </Container>
    )
})

StatProviderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    getDocument: PropTypes.object.isRequired,
    statProviderDialog: PropTypes.shape({
        openStatProviderDialog: PropTypes.bool.isRequired,
        handleOpenStatProviderDialog: PropTypes.func.isRequired,
        handleCloseStatProviderDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatProviderGridList
