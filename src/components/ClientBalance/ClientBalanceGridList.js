import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import ClientBalanceInfoDialog from './ClientBalanceInfoDialog'
import ClientBalanceCreateDialog from './ClientBalanceCreateDialog'
import ClientBalanceUpdateDialog from './ClientBalanceUpdateDialog'
import ClientBalanceFilterForm from './ClientBalanceFilterForm'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import SubMenu from '../SubMenu'
import {hashHistory} from 'react-router'
import {Row} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import ordering from '../../helpers/ordering'
import horizontalScroll from '../../helpers/horizontalScroll'
import {compose, withState, lifecycle} from 'recompose'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/content/remove-circle'
import Add from 'material-ui/svg-icons/content/add-circle'
import Tooltip from '../ToolTip'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen'
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit'
import StatSideMenu from '../Statistics/StatSideMenu'
import {TextField, ClientBalanceTypeSearchField, PaymentTypeSearchField, CheckBox} from '../ReduxForm'
import Pagination from '../GridList/GridListNavPagination'
import NotFound from '../Images/not-found.png'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import {StatisticsFilterExcel} from '../Statistics'
import {CLIENT_BALANCE_FILTER_KEY} from './index'
import t from '../../helpers/translate'

let amountValues = []
let head = []

const types = {
    cash: 'cash',
    bank: 'bank',
    debtor: 'debtor',
    loaner: 'loaner'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        sumLoader: {
            width: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            padding: '0 30px',
            '& .row': {
                margin: '0'
            }
        },
        listRow: {
            margin: '0 -30px !important',
            padding: '0 30px',
            width: 'auto !important',
            '&:hover button': {
                opacity: '1'
            }
        },
        rightAlign: {
            textAlign: 'right',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                position: 'absolute',
                right: '-15px'
            },
            '& button': {
                opacity: '0',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            },
            '& span': {
                cursor: 'pointer'
            }
        },
        red: {
            color: '#e27676',
            fontWeight: '600'
        },
        green: {
            fontWeight: '600',
            color: '#92ce95'
        },
        balance: {
            textAlign: 'right',
            fontWeight: '600',
            '& span': {
                cursor: 'pointer'
            }
        },
        tableRow: {
            cursor: 'pointer',
            '& td': {
                borderRight: '1px #efefef solid',
                textAlign: 'left',
                '&:first-child': {
                    width: '200px !important'
                }
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        tableWrapper: {
            display: 'flex',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
        },
        tableWrapperLoading: {
            display: 'block',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
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
            zIndex: '100'
        },
        leftTable: {
            color: '#666',
            fontWeight: '600',
            zIndex: '4',
            width: '350px',
            boxShadow: '5px 0 8px -3px #ccc',
            '& > div': {
                '&:hover': {
                    '& > div': {
                        opacity: '1'
                    }
                },
                position: 'relative',
                '&:nth-child(odd)': {
                    backgroundColor: '#f9f9f9'
                },
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '41px',
                    borderTop: '1px #efefef solid',
                    borderBottom: '1px #efefef solid'
                },
                '& span': {
                    lineHeight: '40px',
                    paddingLeft: '30px'
                }
            }
        },
        mainTableWrapper: {
            overflowX: 'auto',
            overflowY: 'hidden'
        },
        rightTable: {
            extend: 'leftTable',
            boxSizing: 'content-box',
            boxShadow: 'none',
            borderLeft: '1px #efefef solid',
            borderRight: '1px #efefef solid',
            width: '120px'
        },
        buttonsWrapper: {
            padding: '0 8px',
            display: 'flex !important',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            top: '5px',
            right: '0'
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
                minWidth: '80px'
            },
            '& tr > td:last-child': {
                borderRight: 'none'
            }
        },
        title: {
            fontWeight: '600',
            '& > td': {
                verticalAlign: 'middle'
            },
            '& tr, td': {
                border: '1px #efefef solid'
            }
        },
        nav: {
            borderTop: '1px solid #efefef',
            height: '55px',
            padding: '0 30px',
            margin: ({stat}) => stat ? '0 -30px' : 'unset',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'
        },
        rightPanel: {
            overflowY: 'auto',
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            borderTop: '1px #efefef solid',
            padding: '200px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },
        icon: {
            color: '#666 !important',
            height: '15px !important'
        },
        getDocument: {
            display: 'flex',
            justifyContent: 'flex-end'
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
        groupBy: {
            display: 'flex',
            alignItems: 'center',
            height: '50px',
            margin: '0 -30px',
            padding: '0 30px',
            borderTop: '1px #efefef solid',
            '& > div:first-child': {
                fontWeight: '600',
                marginRight: '10px'
            }
        },
        checkboxes: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                marginRight: '5px',
                whiteSpace: 'nowrap',
                width: 'auto !important'
            }
        },
        flexCenter: {
            display: 'flex',
            alignItems: 'center'
        },
        fullScreen: {
            marginLeft: '10px !important'
        }
    }),
    reduxForm({
        form: 'ClientBalanceForm',
        enableReinitialize: true
    }),
    withState('currentItem', 'setItem', null),
    withState('currentRow', 'setCurrentRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    lifecycle({
        componentDidMount () {
            const mainTable = this.refs.mainTable
            horizontalScroll(mainTable)
        }
    })
)

const searchIconStyle = {
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
const iconStyle = {
    icon: {
        width: 22,
        height: 22
    },
    button: {
        width: 30,
        height: 30,
        padding: 4
    }
}
const styleOnHover = {
    background: '#efefef'
}
const ZERO = 0
const ClientBalanceGridList = enhance((props) => {
    const {
        classes,
        filter,
        createDialog,
        addDialog,
        filterItem,
        infoDialog,
        listData,
        detailData,
        superUser,
        currentItem,
        setItem,
        handleSubmit,
        handleSubmitSearch,
        getDocument,
        stat,
        sumData,
        filterDialog,
        onSubmit,
        setCurrentRow,
        currentRow,
        expandedTable,
        setExpandedTable,
        query
    } = props

    // This constants for Statistics
    const borrowersBank = Math.abs(_.get(sumData, ['sum', 'borrowersSumBank']))
    const borrowersBankCount = _.get(sumData, ['sum', 'borrowersCountBank'])
    const borrowersCash = Math.abs(_.get(sumData, ['sum', 'borrowersSumCash']))
    const borrowersCashCount = _.get(sumData, ['sum', 'borrowersCountCash'])
    const loanersBank = Math.abs(_.get(sumData, ['sum', 'loanersSumBank']))
    const loanersBankCount = _.get(sumData, ['sum', 'loanersCountBank'])
    const loanersCash = Math.abs(_.get(sumData, ['sum', 'loanersSumCash']))
    const loanersCashCount = _.get(sumData, ['sum', 'loanersCountCash'])
    const sumLoading = _.get(sumData, ['sumLoading'])

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
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const isSuperUser = _.get(superUser, 'isSuperUser')
    const clients = (
        <div className={classes.leftTable}>
            <div><span>Клиент</span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name') || 'No'
                return (
                    <div
                        key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => setCurrentRow(id)}
                        onMouseLeave={() => setCurrentRow(null)}><span>{name}</span>
                        {!stat && isSuperUser &&
                        id === currentRow && <div key={id} className={classes.buttonsWrapper}>
                            <Tooltip position="bottom" text={t('Списать')}>
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}
                                    onTouchTap={() => {
                                        createDialog.handleOpenCreateDialog(id)
                                    }}>
                                    <Cancel color='#ff584b'/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip position="bottom" text={t('Добавить')}>
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}
                                    onTouchTap={() => {
                                        addDialog.handleOpenAddDialog(id)
                                    }}>
                                    <Add color='#8dc572'/>
                                </IconButton>
                            </Tooltip>
                        </div>}
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

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td
                    style={{cursor: 'pointer'}}
                    onClick={() => { orderingFunction('orders') }}>
                    {t('Кол-во заказов')} {orderNoSorting}
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
                const orderNo = numberFormat(_.get(item, 'orders'))
                amountValues = []
                _.map(_.get(item, 'divisions'), (child) => {
                    amountValues.push({amount: _.get(child, 'cash'), type: 'cash', id: _.get(child, 'id')})
                    amountValues.push({amount: _.get(child, 'bank'), type: 'bank', id: _.get(child, 'id')})
                })
                const totalSum = _.toNumber(_.get(item, 'total'))
                return (
                    <tr key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => setCurrentRow(id)}
                        onMouseLeave={() => setCurrentRow(null)}
                        onClick={() => { infoDialog.handleOpenInfoDialog(id) }}
                        className={classes.tableRow}>
                        <td>{orderNo}</td>
                        <td><span className={totalSum > ZERO ? classes.green : totalSum < ZERO ? classes.red : ''}>{numberFormat(totalSum, primaryCurrency)}</span></td>
                        {_.map(amountValues, (val, index) => {
                            const amount = _.toNumber(_.get(val, 'amount'))
                            return (
                                <td key={index}>
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

    const emptyData = _.isEmpty(_.get(listData, 'data'))
    const lists = (
        <div className={(listLoading || emptyData)
            ? classes.tableWrapperLoading
            : classes.tableWrapper}
             style={!stat ? {marginBottom: 30} : {}}>
            {listLoading &&
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>}
            {!listLoading && emptyData &&
            <div className={classes.emptyQuery}>
                <div>{t('По вашему запросу ничего не найдено')}</div>
            </div>}
            {!listLoading && !emptyData && clients}
            <div ref="mainTable" className={classes.mainTableWrapper} style={{width: 'calc(100% - 350px)'}}>
                {!listLoading && !emptyData && tableList}
            </div>
        </div>
    )

    const client = _.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')})

    const amount = _.toNumber(_.get(currentItem, 'amount'))
    const internal = _.toNumber(_.get(currentItem, 'internal'))
    const initialValues = {
        currency: {
            value: _.get(currentItem, ['currency', 'id'])
        },
        custom_rate: !_.isNil(_.get(currentItem, 'customRate')) ? _.get(currentItem, 'customRate') : _.toInteger(amount / internal),
        paymentType: {
            value: _.get(currentItem, 'paymentType')
        },
        amount: _.get(currentItem, 'amount'),
        division: {
            value: _.get(currentItem, ['division', 'id'])
        },
        comment: _.get(currentItem, 'comment'),
        user: {
            value: _.get(currentItem, ['user', 'id'])
        }
    }

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="balanceType"
                component={ClientBalanceTypeSearchField}
                label={t('Тип баланса')}
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="paymentType"
                component={PaymentTypeSearchField}
                label={t('Тип оплаты')}
                fullWidth={true}/>
        </div>
    )

    const groupBy = (
        <div className={classes.groupBy}>
            <div>Сгруппировать по:</div>
            <div className={classes.checkboxes}>
                <Field
                    name="[groupBy][division][active]"
                    label={t('Организациям')}
                    component={CheckBox}
                />
                <Field
                    name="[groupBy][currency][active]"
                    label={t('Валюте')}
                    component={CheckBox}
                />
                <Field
                    name="[groupBy][paymentType][active]"
                    label={t('Типу оплат')}
                    component={CheckBox}
                />
            </div>
        </div>
    )

    const navigation = (
        <div className={classes.nav}>
            {!stat && <ClientBalanceFilterForm
                initialValues={filterDialog.initialValues}
                filter={filter}
                filterDialog={filterDialog}/>}
            <form style={{display: 'flex', alignItems: 'center'}} onSubmit={handleSubmit(handleSubmitSearch)}>
                <Field
                    className={classes.inputFieldCustom}
                    component={TextField}
                    name="searching"
                    label={t('Поиск')}
                />
                <IconButton
                    type="submit"
                    iconStyle={searchIconStyle.icon}
                    style={searchIconStyle.button}
                    touch={true}>
                    <SearchIcon color='#ccc'/>
                </IconButton>
            </form>
            <div className={classes.flexCenter}>
                <Pagination filter={filter}/>
                {expandedTable &&
                <Tooltip position="left" text={t('Обычный вид')}>
                    <IconButton
                        className={classes.fullScreen}
                        onTouchTap={() => { setExpandedTable(!expandedTable) }}
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}>
                        <FullScreenExit color="#666"/>
                    </IconButton>
                </Tooltip>}
                {!expandedTable &&
                <Tooltip position="left" text={t('Расширенный вид')}>
                    <IconButton
                        className={classes.fullScreen}
                        onTouchTap={() => { setExpandedTable(!expandedTable) }}
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}>
                        <FullScreen color="#666"/>
                    </IconButton>
                </Tooltip>}
            </div>
        </div>
    )
    const summary = (
        sumLoading
        ? <div className={classes.sumLoader}>
            <Loader size={0.75}/>
        </div>
        : <div className={classes.summaryWrapper}>
            <div
                onClick={() => hashHistory.push({
                    pathname: props.pathname,
                    query: filter.getParams({
                        [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.cash,
                        [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.debtor})
                })}>
                {t('Задолжники нал')}. - {borrowersCashCount}
                <div>{numberFormat(borrowersCash, primaryCurrency)}</div>
            </div>
            <div
                onClick={() => hashHistory.push({
                    pathname: props.pathname,
                    query: filter.getParams({
                        [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.bank,
                        [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.debtor})
                })}>
                {t('Задолжники переч')}. - {borrowersBankCount}
                <div>{numberFormat(borrowersBank, primaryCurrency)}</div>
            </div>
            <div
                onClick={() => hashHistory.push({
                    pathname: props.pathname,
                    query: filter.getParams({
                        [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.cash,
                        [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.loaner})
                })}>
                {t('Закладчики нал')}. - {loanersCashCount}
                <div>{numberFormat(loanersCash, primaryCurrency)}</div>
            </div>
            <div
                onClick={() => hashHistory.push({
                    pathname: props.pathname,
                    query: filter.getParams({
                        [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: types.bank,
                        [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: types.loaner})
                })}>
                {t('Закладчики переч')}. - {loanersBankCount}
                <div>{numberFormat(loanersBank, primaryCurrency)}</div>
            </div>
        </div>
    )
    return (
        <Container>
            {stat &&
            <div className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_CLIENT_BALANCE_URL}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <div style={{marginTop: '20px'}}>
                                <StatisticsFilterExcel
                                    filter={filter}
                                    fields={fields}
                                    filterKeys={CLIENT_BALANCE_FILTER_KEY}
                                    handleGetDocument={getDocument.handleGetDocument}
                                    handleSubmitFilterDialog={onSubmit}
                                    withoutDate={true}
                                    initialValues={filterDialog.initialValues}
                                />
                            </div>
                            <div className={classes.summary}>
                                {summary}
                            </div>
                            {false && groupBy}
                            <div className={expandedTable ? classes.expandedTable : ''}>
                                {navigation}
                                {lists}
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
            }
            {!stat && <SubMenu url={ROUTES.CLIENT_BALANCE_LIST_URL}/>}
            {!stat && <Paper style={{marginBottom: '15px', padding: '10px 30px'}}>{summary}</Paper>}
            {!stat && <Paper className={expandedTable ? classes.expandedTable : ''} style={expandedTable ? {padding: '0'} : {}}>
                {navigation}
                {lists}
            </Paper>}

            <ClientBalanceInfoDialog
                stat={stat}
                open={infoDialog.openInfoDialog}
                detailData={detailData}
                onClose={infoDialog.handleCloseInfoDialog}
                filterItem={filterItem}
                filter={filter}
                name={_.get(client, 'name')}
                paymentType={_.get(infoDialog, ['division', 'name']) + _.get(infoDialog, 'type')}
                balance={_.get(infoDialog, 'balance')}
                superUser={superUser}
                setItem={setItem}
                info={infoDialog.info}
                infoLoading={infoDialog.infoLoading}
            />
            {!stat && <ClientBalanceCreateDialog
                open={_.get(createDialog, 'openCreateDialog')}
                listData={listData}
                detailData={detailData}
                loading={_.get(createDialog, 'createLoading')}
                onClose={_.get(createDialog, 'handleCloseCreateDialog')}
                onSubmit={_.get(createDialog, 'handleSubmitCreateDialog')}
                name={_.get(client, 'name')}
            />}
            {!stat && isSuperUser && !_.isNull(currentItem) && <ClientBalanceUpdateDialog
                initialValues={initialValues}
                isUpdate={true}
                open={_.get(superUser, 'open')}
                loading={_.get(superUser, 'loading')}
                onClose={_.get(superUser, 'handleCloseSuperUserDialog')}
                onSubmit={_.get(superUser, 'handleSubmitSuperUserDialog')}
                name={_.get(client, 'name')}
            />}
            {!stat && <ClientBalanceCreateDialog
                open={_.get(addDialog, 'openAddDialog')}
                listData={listData}
                detailData={detailData}
                loading={_.get(addDialog, 'addLoading')}
                onClose={_.get(addDialog, 'handleCloseAddDialog')}
                onSubmit={_.get(addDialog, 'handleSubmitAddDialog')}
                addDialog={true}
                name={_.get(client, 'name')}
            />}
        </Container>
    )
})

ClientBalanceGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    infoDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openInfoDialog: PropTypes.bool.isRequired,
        handleOpenInfoDialog: PropTypes.func.isRequired,
        handleCloseInfoDialog: PropTypes.func.isRequired
    }).isRequired,
    createDialog: PropTypes.shape({
        createLoading: PropTypes.bool,
        openCreateDialog: PropTypes.bool,
        handleOpenCreateDialog: PropTypes.func,
        handleCloseCreateDialog: PropTypes.func,
        handleSubmitCreateDialog: PropTypes.func
    }),
    superUser: PropTypes.shape({
        open: PropTypes.bool,
        loading: PropTypes.bool,
        handleOpenSuperUserDialog: PropTypes.func,
        handleCloseSuperUserDialog: PropTypes.func,
        handleSubmitSuperUserDialog: PropTypes.func
    })
}

export default ClientBalanceGridList
